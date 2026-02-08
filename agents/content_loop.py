#!/usr/bin/env python3
"""
NovaClaw AI - Autonomous Content Loop Agent
============================================
This agent runs every 12 hours via GitHub Actions to:
1. Scrape trends from free sources (HackerNews, RSS feeds)
2. Generate content using Claude API
3. Create visuals using Pollinations.ai (free)
4. Run critic agent for quality/GDPR check
5. Schedule distribution
"""

import os
import json
import re
import time
import hashlib
import asyncio
import aiohttp
import feedparser
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Any
from dataclasses import dataclass, asdict
from supabase import create_client, Client


def extract_json(text: str) -> Any:
    """Extract JSON from Claude response, handling markdown code blocks and extra text."""
    # Strip whitespace
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code block ```json ... ```
    match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Try finding first [ or { and matching to last ] or }
    for start_char, end_char in [('[', ']'), ('{', '}')]:
        start = text.find(start_char)
        end = text.rfind(end_char)
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except json.JSONDecodeError:
                pass

    raise json.JSONDecodeError("No valid JSON found in response", text, 0)

# ============================================
# CONFIGURATION
# ============================================

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

# Free RSS feeds for trend scraping
RSS_FEEDS = [
    {"url": "https://hnrss.org/frontpage", "source": "hackernews", "category": "tech"},
    {"url": "https://feeds.feedburner.com/TechCrunch/", "source": "techcrunch", "category": "tech"},
    {"url": "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", "source": "nytimes", "category": "tech"},
    {"url": "https://www.reddit.com/r/marketing/.rss", "source": "reddit", "category": "marketing"},
]

# Content generation settings
PLATFORMS = ["linkedin", "twitter", "instagram"]
CONTENT_TYPES = {
    "linkedin": {"max_length": 3000, "style": "professional, insightful"},
    "twitter": {"max_length": 280, "style": "concise, engaging, with hook"},
    "instagram": {"max_length": 2200, "style": "casual, visual-focused, emoji-friendly"},
}


# ============================================
# DATA CLASSES
# ============================================

@dataclass
class Trend:
    source: str
    category: str
    title: str
    url: str
    summary: str
    relevance_score: float


@dataclass
class GeneratedContent:
    platform: str
    content: str
    media_prompt: Optional[str]
    hashtags: List[str]
    trend_source: str


@dataclass
class AgentLog:
    agent_type: str
    action: str
    status: str
    input: Dict
    output: Dict
    error: Optional[str]
    duration_ms: Optional[int]


# ============================================
# SUPABASE CLIENT
# ============================================

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing Supabase credentials")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def log_agent_action(supabase: Client, log: AgentLog):
    """Log agent activity to Supabase"""
    try:
        supabase.table("agent_logs").insert(asdict(log)).execute()
    except Exception as e:
        print(f"Failed to log: {e}")


# ============================================
# TREND SCRAPER AGENT
# ============================================

async def scrape_trends(session: aiohttp.ClientSession) -> List[Trend]:
    """Scrape trends from multiple RSS feeds"""
    trends = []

    for feed_config in RSS_FEEDS:
        try:
            async with session.get(feed_config["url"], timeout=10) as response:
                if response.status == 200:
                    content = await response.text()
                    parsed = feedparser.parse(content)

                    for entry in parsed.entries[:5]:  # Top 5 from each source
                        trend = Trend(
                            source=feed_config["source"],
                            category=feed_config["category"],
                            title=entry.get("title", "")[:300],
                            url=entry.get("link", ""),
                            summary=entry.get("summary", "")[:500] if entry.get("summary") else "",
                            relevance_score=0.0  # Will be scored later
                        )
                        trends.append(trend)
        except Exception as e:
            print(f"Error scraping {feed_config['source']}: {e}")
            continue

    return trends


async def score_trends(trends: List[Trend], session: aiohttp.ClientSession) -> List[Trend]:
    """Score trends for relevance using Claude (batch for efficiency)"""
    if not ANTHROPIC_API_KEY:
        # Fallback: simple keyword scoring
        keywords = ["ai", "automation", "marketing", "business", "growth", "startup"]
        for trend in trends:
            score = sum(1 for k in keywords if k in trend.title.lower()) / len(keywords)
            trend.relevance_score = round(score, 2)
        return sorted(trends, key=lambda t: t.relevance_score, reverse=True)

    # Use Claude for intelligent scoring
    trend_texts = "\n".join([f"- {t.title}" for t in trends[:20]])

    prompt = f"""Score these trends 0.0-1.0 for relevance to B2B marketing/AI automation audience.
Return ONLY a JSON array of scores in order, nothing else.

Trends:
{trend_texts}"""

    try:
        async with session.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 200,
                "messages": [{"role": "user", "content": prompt}]
            }
        ) as response:
            if response.status == 200:
                data = await response.json()
                raw_text = data["content"][0]["text"]
                scores = extract_json(raw_text)
                for i, score in enumerate(scores):
                    if i < len(trends):
                        trends[i].relevance_score = float(score)
            else:
                error_text = await response.text()
                print(f"Claude scoring API error {response.status}: {error_text[:200]}")
    except Exception as e:
        print(f"Claude scoring failed: {e}")

    return sorted(trends, key=lambda t: t.relevance_score, reverse=True)


# ============================================
# CONTENT GENERATOR AGENT
# ============================================

async def generate_content(
    trend: Trend,
    platform: str,
    session: aiohttp.ClientSession
) -> Optional[GeneratedContent]:
    """Generate platform-specific content from a trend"""

    if not ANTHROPIC_API_KEY:
        # Demo mode
        return GeneratedContent(
            platform=platform,
            content=f"🚀 Trending: {trend.title}\n\n#AI #Marketing #Automation",
            media_prompt=f"Futuristic digital visualization of {trend.title[:50]}",
            hashtags=["AI", "Marketing", "Automation"],
            trend_source=trend.url
        )

    config = CONTENT_TYPES[platform]

    prompt = f"""Create a {platform} post about this trend for a B2B marketing/AI automation audience.

Trend: {trend.title}
Summary: {trend.summary}

Requirements:
- Style: {config['style']}
- Max length: {config['max_length']} characters
- Include 3-5 relevant hashtags
- Include a hook in the first line
- Add a call-to-action at the end

Return JSON:
{{"content": "...", "hashtags": ["...", "..."], "image_prompt": "description for AI image generation"}}"""

    try:
        async with session.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 1000,
                "messages": [{"role": "user", "content": prompt}]
            }
        ) as response:
            if response.status == 200:
                data = await response.json()
                raw_text = data["content"][0]["text"]
                result = extract_json(raw_text)
                return GeneratedContent(
                    platform=platform,
                    content=result["content"][:config["max_length"]],
                    media_prompt=result.get("image_prompt"),
                    hashtags=result.get("hashtags", []),
                    trend_source=trend.url
                )
            else:
                error_text = await response.text()
                print(f"Content gen API error {response.status}: {error_text[:200]}")
    except Exception as e:
        print(f"Content generation failed: {e}")

    return None


# ============================================
# VISUAL GENERATOR AGENT (Pollinations.ai - FREE)
# ============================================

async def generate_visual(prompt: str, session: aiohttp.ClientSession) -> Optional[str]:
    """Generate image using free Pollinations.ai API"""

    if not prompt:
        return None

    # Pollinations.ai URL-based API (completely free)
    enhanced_prompt = f"{prompt}, professional, modern, minimalist, tech aesthetic, high quality"
    encoded_prompt = enhanced_prompt.replace(" ", "%20")

    # Pollinations generates images via URL
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=675&nologo=true"

    # Verify the URL works
    try:
        async with session.head(image_url, timeout=30) as response:
            if response.status == 200:
                return image_url
    except Exception as e:
        print(f"Visual generation failed: {e}")

    return None


# ============================================
# CRITIC AGENT (Quality & GDPR Check)
# ============================================

async def critic_review(
    content: GeneratedContent,
    session: aiohttp.ClientSession
) -> Dict[str, Any]:
    """Second Claude instance reviews content for quality and compliance"""

    if not ANTHROPIC_API_KEY:
        return {"approved": True, "score": 0.85, "feedback": "Demo mode - auto-approved"}

    prompt = f"""Review this {content.platform} marketing post for quality and compliance.

Content:
{content.content}

Check for:
1. Quality (engaging, professional, on-brand)
2. Accuracy (no false claims)
3. GDPR compliance (no personal data exposure)
4. Platform appropriateness
5. Potential controversy/risk

Return JSON:
{{"approved": true/false, "score": 0.0-1.0, "feedback": "...", "suggested_edits": "..." or null}}"""

    try:
        async with session.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 500,
                "messages": [{"role": "user", "content": prompt}]
            }
        ) as response:
            if response.status == 200:
                data = await response.json()
                raw_text = data["content"][0]["text"]
                return extract_json(raw_text)
            else:
                error_text = await response.text()
                print(f"Critic API error {response.status}: {error_text[:200]}")
    except Exception as e:
        print(f"Critic review failed: {e}")

    # Fail-safe: require manual review if critic fails
    return {"approved": False, "score": 0.0, "feedback": "Critic agent unavailable - manual review required"}


# ============================================
# DISTRIBUTION SCHEDULER
# ============================================

def schedule_content(
    supabase: Client,
    content: GeneratedContent,
    media_url: Optional[str],
    critic_result: Dict
):
    """Save content to calendar and schedule distribution"""

    # Calculate optimal posting time (simple: next available slot)
    now = datetime.utcnow()

    # Optimal posting hours by platform
    optimal_hours = {
        "linkedin": [8, 10, 12],  # Business hours
        "twitter": [9, 12, 17],   # Throughout day
        "instagram": [11, 14, 19] # Midday and evening
    }

    hours = optimal_hours.get(content.platform, [10])
    base_time = now.replace(hour=hours[0], minute=0, second=0, microsecond=0)

    if base_time <= now:
        base_time += timedelta(days=1)

    # Insert into content calendar
    record = {
        "type": "text" if not media_url else "image",
        "platform": content.platform,
        "title": content.content[:100],
        "content": content.content,
        "media_url": media_url,
        "hashtags": content.hashtags,
        "scheduled_for": base_time.isoformat(),
        "status": "scheduled" if critic_result.get("approved") else "review",
        "trend_source": content.trend_source,
        "critic_score": critic_result.get("score", 0),
        "critic_feedback": critic_result.get("feedback"),
    }

    result = supabase.table("content_calendar").insert(record).execute()
    return result.data[0] if result.data else None


# ============================================
# MAIN CONTENT LOOP
# ============================================

async def run_content_loop():
    """Main orchestration function"""

    print("=" * 50)
    print("NovaClaw AI - Content Loop Agent Starting")
    print(f"Time: {datetime.utcnow().isoformat()}")
    print("=" * 50)

    supabase = get_supabase()
    start_time = time.time()

    # Log start
    log_agent_action(supabase, AgentLog(
        agent_type="scraper",
        action="content_loop_start",
        status="running",
        input={"platforms": PLATFORMS},
        output={},
        error=None,
        duration_ms=None
    ))

    async with aiohttp.ClientSession() as session:
        # STEP 1: Scrape trends
        print("\n[1/5] Scraping trends...")
        trends = await scrape_trends(session)
        print(f"    Found {len(trends)} raw trends")

        # STEP 2: Score and rank trends
        print("\n[2/5] Scoring trends...")
        trends = await score_trends(trends, session)
        top_trends = trends[:3]  # Top 3 trends
        print(f"    Top trends: {[t.title[:50] for t in top_trends]}")

        # Store trends in database
        for trend in top_trends:
            try:
                supabase.table("trends").insert({
                    "source": trend.source,
                    "category": trend.category,
                    "title": trend.title,
                    "url": trend.url,
                    "summary": trend.summary,
                    "relevance_score": trend.relevance_score,
                }).execute()
            except:
                pass  # Ignore duplicates

        # STEP 3: Generate content for each platform
        print("\n[3/5] Generating content...")
        generated_content = []

        for trend in top_trends[:1]:  # Use top trend
            for platform in PLATFORMS:
                content = await generate_content(trend, platform, session)
                if content:
                    generated_content.append(content)
                    print(f"    ✓ Generated for {platform}")

        # STEP 4: Generate visuals
        print("\n[4/5] Generating visuals...")
        content_with_media = []

        for content in generated_content:
            media_url = None
            if content.media_prompt:
                media_url = await generate_visual(content.media_prompt, session)
                if media_url:
                    print(f"    ✓ Visual generated for {content.platform}")
            content_with_media.append((content, media_url))

        # STEP 5: Critic review and scheduling
        print("\n[5/5] Critic review & scheduling...")
        scheduled_count = 0

        for content, media_url in content_with_media:
            critic_result = await critic_review(content, session)

            if critic_result.get("score", 0) >= 0.6:
                result = schedule_content(supabase, content, media_url, critic_result)
                if result:
                    scheduled_count += 1
                    status = "✓ Scheduled" if critic_result.get("approved") else "⚠ Needs review"
                    print(f"    {status}: {content.platform} (score: {critic_result.get('score', 0):.2f})")
            else:
                print(f"    ✗ Rejected: {content.platform} (score: {critic_result.get('score', 0):.2f})")

    # Log completion
    duration = int((time.time() - start_time) * 1000)

    log_agent_action(supabase, AgentLog(
        agent_type="scraper",
        action="content_loop_complete",
        status="success",
        input={"platforms": PLATFORMS},
        output={
            "trends_found": len(trends),
            "content_generated": len(generated_content),
            "content_scheduled": scheduled_count
        },
        error=None,
        duration_ms=duration
    ))

    print("\n" + "=" * 50)
    print(f"Content Loop Complete!")
    print(f"Duration: {duration}ms")
    print(f"Scheduled: {scheduled_count} posts")
    print("=" * 50)


# ============================================
# ENTRY POINT
# ============================================

if __name__ == "__main__":
    asyncio.run(run_content_loop())
