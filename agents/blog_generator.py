#!/usr/bin/env python3
"""
NovaClaw AI - Autonomous Blog Generator Agent
===============================================
Runs daily via GitHub Actions to:
1. Scrape AI trends from multiple sources
2. Score trends for relevance
3. Generate 2 blog articles (1 NL + 1 EN) using Claude
4. Critic review for quality
5. Save to Supabase content_calendar
"""

import os
import json
import re
import time
import asyncio
import aiohttp
import feedparser
from datetime import datetime
from typing import Optional, Dict, List, Any
from dataclasses import dataclass, asdict
from supabase import create_client, Client

# ============================================
# CONFIGURATION
# ============================================

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"

# AI-focused RSS feeds for trend scraping
AI_RSS_FEEDS = [
    {"url": "https://hnrss.org/frontpage", "source": "hackernews", "category": "tech"},
    {"url": "https://feeds.feedburner.com/TechCrunch/", "source": "techcrunch", "category": "tech"},
    {"url": "https://www.reddit.com/r/artificial/.rss", "source": "reddit_ai", "category": "AI"},
    {"url": "https://www.reddit.com/r/MachineLearning/.rss", "source": "reddit_ml", "category": "AI"},
    {"url": "https://www.reddit.com/r/ChatGPT/.rss", "source": "reddit_chatgpt", "category": "AI"},
    {"url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "source": "theverge", "category": "AI"},
    {"url": "https://feeds.arstechnica.com/arstechnica/features", "source": "arstechnica", "category": "tech"},
]

# Claude model for content generation
CLAUDE_MODEL = "claude-haiku-4-5-20251001"

# NovaClaw context for article generation
NOVACLAW_CONTEXT = """
NovaClaw is een Nederlands AI agency dat custom AI agents bouwt voor bedrijven.
18+ agent types: Klantenservice, Voice, Chatbot, Helpdesk, Content, SEO & AIO,
Email Marketing, Social Media, Ads & Campaign, Lead Generation, Appointment Setter,
E-commerce, Automation, Data & Analytics, Data Entry, Compliance, Web Scraping, Custom.
Tech-agnostisch: OpenAI GPT-4o, Anthropic Claude, Google Gemini, Meta Llama.
Website: novaclaw.tech | Email: info@novaclaw.tech
"""


def extract_json(text: str) -> Any:
    """Extract JSON from Claude response, handling markdown code blocks."""
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass
    for start_char, end_char in [('{', '}'), ('[', ']')]:
        start = text.find(start_char)
        end = text.rfind(end_char)
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except json.JSONDecodeError:
                pass
    raise json.JSONDecodeError("No valid JSON found", text, 0)


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')
    return text[:80]


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
class BlogArticle:
    lang: str
    title: str
    slug: str
    description: str
    content: str
    category: str
    tags: List[str]
    reading_time: str
    trend_source: str


# ============================================
# SUPABASE
# ============================================

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing Supabase credentials")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def log_agent_action(supabase: Client, agent_type: str, action: str, status: str,
                     input_data: Dict, output_data: Dict, error: Optional[str] = None,
                     duration_ms: Optional[int] = None):
    try:
        supabase.table("agent_logs").insert({
            "agent_type": agent_type,
            "action": action,
            "status": status,
            "input": input_data,
            "output": output_data,
            "error": error,
            "duration_ms": duration_ms,
        }).execute()
    except Exception as e:
        print(f"  [warn] Failed to log: {e}")


def check_slug_exists(supabase: Client, slug: str) -> bool:
    """Check if a blog post with this slug already exists in Supabase."""
    try:
        result = supabase.table("content_calendar") \
            .select("id") \
            .eq("platform", "blog") \
            .ilike("content", f"%slug: {slug}%") \
            .execute()
        return len(result.data) > 0
    except:
        return False


# ============================================
# TREND SCRAPER
# ============================================

async def scrape_ai_trends(session: aiohttp.ClientSession) -> List[Trend]:
    """Scrape AI-related trends from RSS feeds."""
    trends = []
    for feed_config in AI_RSS_FEEDS:
        try:
            async with session.get(
                feed_config["url"],
                timeout=aiohttp.ClientTimeout(total=15),
                headers={"User-Agent": "NovaClaw-BlogAgent/1.0"}
            ) as response:
                if response.status == 200:
                    content = await response.text()
                    parsed = feedparser.parse(content)
                    for entry in parsed.entries[:5]:
                        title = entry.get("title", "")
                        if not title:
                            continue
                        # Filter for AI-related content
                        ai_keywords = ["ai", "artificial intelligence", "machine learning",
                                       "chatgpt", "llm", "agent", "automation", "neural",
                                       "openai", "anthropic", "gemini", "deep learning",
                                       "gpt", "claude", "robot", "generative"]
                        title_lower = title.lower()
                        if any(kw in title_lower for kw in ai_keywords) or feed_config["category"] == "AI":
                            trends.append(Trend(
                                source=feed_config["source"],
                                category=feed_config["category"],
                                title=title[:300],
                                url=entry.get("link", ""),
                                summary=entry.get("summary", "")[:500] if entry.get("summary") else "",
                                relevance_score=0.0,
                            ))
        except Exception as e:
            print(f"  [warn] Error scraping {feed_config['source']}: {e}")
    return trends


async def score_trends(trends: List[Trend], session: aiohttp.ClientSession) -> List[Trend]:
    """Score trends for blog-worthiness using Claude."""
    if not trends:
        return []

    if not ANTHROPIC_API_KEY:
        # Fallback keyword scoring
        for trend in trends:
            score = 0.5
            for kw in ["agent", "automation", "business", "company", "enterprise", "saas"]:
                if kw in trend.title.lower():
                    score += 0.1
            trend.relevance_score = min(score, 1.0)
        return sorted(trends, key=lambda t: t.relevance_score, reverse=True)

    trend_texts = "\n".join([f"{i+1}. {t.title}" for i, t in enumerate(trends[:20])])

    prompt = f"""Score these AI/tech trends 0.0-1.0 for how interesting they would be as a blog article
for a B2B audience interested in AI agents, automation, and business AI applications.

Higher scores for:
- AI agents, automation, business use cases
- New AI models, breakthroughs, tools
- Industry trends that affect SMBs
- Topics where NovaClaw (AI agent agency) could add perspective

Lower scores for:
- Pure academic/research without business relevance
- Crypto/blockchain unrelated to AI
- Gaming/entertainment AI

Trends:
{trend_texts}

Return ONLY a JSON array of numbers (scores), one per trend, in order. Nothing else."""

    try:
        async with session.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": CLAUDE_MODEL,
                "max_tokens": 300,
                "messages": [{"role": "user", "content": prompt}]
            }
        ) as response:
            if response.status == 200:
                data = await response.json()
                raw = data["content"][0]["text"]
                scores = extract_json(raw)
                for i, score in enumerate(scores):
                    if i < len(trends):
                        trends[i].relevance_score = float(score)
            else:
                print(f"  [warn] Claude scoring error: {response.status}")
    except Exception as e:
        print(f"  [warn] Scoring failed: {e}")

    return sorted(trends, key=lambda t: t.relevance_score, reverse=True)


# ============================================
# BLOG ARTICLE GENERATOR
# ============================================

async def generate_blog_article(
    trend: Trend,
    lang: str,
    session: aiohttp.ClientSession
) -> Optional[BlogArticle]:
    """Generate a full blog article based on a trend."""

    if not ANTHROPIC_API_KEY:
        print(f"  [skip] No API key — cannot generate {lang} article")
        return None

    lang_name = "Dutch (Nederlands)" if lang == "nl" else "English"
    cta_nl = """

## Klaar om AI agents in te zetten voor jouw bedrijf?

De AI-ontwikkelingen gaan razendsnel. Bedrijven die nu beginnen met AI agents bouwen een voorsprong die moeilijk in te halen is. NovaClaw bouwt custom AI agents op maat van jouw bedrijf — van klantenservice tot leadgeneratie, van content automation tot data analytics.

**Plan een gratis kennismakingsgesprek** en ontdek welke AI agents het verschil maken voor jouw bedrijf. Ga naar [novaclaw.tech](https://novaclaw.tech) of mail naar info@novaclaw.tech."""

    cta_en = """

## Ready to deploy AI agents for your business?

AI developments are moving fast. Businesses that start with AI agents now are building a lead that's hard to catch up to. NovaClaw builds custom AI agents tailored to your business — from customer service to lead generation, from content automation to data analytics.

**Schedule a free consultation** and discover which AI agents can make a difference for your business. Visit [novaclaw.tech](https://novaclaw.tech) or email info@novaclaw.tech."""

    cta = cta_nl if lang == "nl" else cta_en

    prompt = f"""You are an expert AI technology blogger writing for {lang_name} audience.

Write a complete blog article based on this trending AI topic:

TREND: {trend.title}
SUMMARY: {trend.summary}
SOURCE: {trend.source}

REQUIREMENTS:
- Language: {lang_name}
- Length: 1000-1500 words
- Format: Markdown with ## H2 and ### H3 headers
- Style: Professional but accessible, insightful analysis
- Structure:
  1. Attention-grabbing introduction explaining why this matters
  2. What happened / what's the trend (factual, cite the trend)
  3. Why this matters for businesses
  4. How AI agents can help businesses capitalize on this trend
  5. Practical implications and what to expect next
- IMPORTANT for AIO (AI Optimization):
  - Use clear, factual statements that AI search engines can cite
  - Include question-style H2/H3 headings (e.g. "What does this mean for businesses?")
  - Write definitive, quotable paragraphs
  - Mention specific NovaClaw agent types where relevant (naturally, not forced)

{NOVACLAW_CONTEXT}

Return ONLY a JSON object:
{{
  "title": "Article title (compelling, SEO-optimized, max 80 chars)",
  "slug": "url-friendly-slug-max-60-chars",
  "description": "Meta description, 150-160 chars, compelling",
  "content": "Full markdown article content (1000-1500 words). Do NOT include the CTA at the end — that will be added automatically.",
  "category": "One of: AI Trends, AI voor Business, AI Agents, AIO & SEO, Automation",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "reading_time": "X min"
}}"""

    try:
        async with session.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": CLAUDE_MODEL,
                "max_tokens": 4000,
                "messages": [{"role": "user", "content": prompt}]
            }
        ) as response:
            if response.status == 200:
                data = await response.json()
                raw = data["content"][0]["text"]
                result = extract_json(raw)
                if isinstance(result, list):
                    result = result[0]

                # Append CTA to content
                content_with_cta = result["content"] + cta

                # Ensure slug is unique by adding lang suffix
                slug = slugify(result["slug"])
                if not slug.endswith(f"-{lang}") and lang == "en":
                    slug = slug + "-en"

                return BlogArticle(
                    lang=lang,
                    title=result["title"],
                    slug=slug,
                    description=result["description"],
                    content=content_with_cta,
                    category=result.get("category", "AI Trends"),
                    tags=result.get("tags", ["AI", "agents"]),
                    reading_time=result.get("reading_time", "6 min"),
                    trend_source=trend.url,
                )
            else:
                error_text = await response.text()
                print(f"  [error] Claude generation error {response.status}: {error_text[:200]}")
    except Exception as e:
        print(f"  [error] Blog generation failed: {e}")

    return None


# ============================================
# CRITIC AGENT
# ============================================

async def review_article(
    article: BlogArticle,
    session: aiohttp.ClientSession
) -> Dict[str, Any]:
    """Review article quality via Claude critic."""

    if not ANTHROPIC_API_KEY:
        return {"approved": True, "score": 0.8, "feedback": "No API key - auto-approved"}

    prompt = f"""Review this blog article for quality, accuracy, and AIO optimization.

TITLE: {article.title}
LANGUAGE: {article.lang}
CONTENT (first 500 chars): {article.content[:500]}

Check:
1. Quality: Is it engaging, well-structured, informative?
2. Accuracy: No false claims or hallucinated facts?
3. AIO: Does it have clear headers, factual statements, quotable paragraphs?
4. Brand: Is the NovaClaw mention natural (not forced)?
5. Language: Is the {article.lang} correct and fluent?

Return JSON: {{"approved": true/false, "score": 0.0-1.0, "feedback": "brief feedback"}}"""

    try:
        async with session.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": CLAUDE_MODEL,
                "max_tokens": 300,
                "messages": [{"role": "user", "content": prompt}]
            }
        ) as response:
            if response.status == 200:
                data = await response.json()
                raw = data["content"][0]["text"]
                result = extract_json(raw)
                if isinstance(result, list):
                    result = result[0]
                return result
            else:
                print(f"  [warn] Critic error: {response.status}")
    except Exception as e:
        print(f"  [warn] Critic failed: {e}")

    return {"approved": True, "score": 0.7, "feedback": "Critic unavailable - auto-approved"}


# ============================================
# SAVE TO SUPABASE
# ============================================

def save_blog_post(supabase: Client, article: BlogArticle, critic_result: Dict) -> Optional[Dict]:
    """Save blog article to Supabase content_calendar."""

    # Build metadata JSON that the blog frontend will read
    metadata = {
        "lang": article.lang,
        "slug": article.slug,
        "description": article.description,
        "category": article.category,
        "tags": article.tags,
        "reading_time": article.reading_time,
        "trend_source": article.trend_source,
        "critic_score": critic_result.get("score", 0),
        "generated_at": datetime.utcnow().isoformat(),
        "author": "NovaClaw AI Team",
    }

    # Content format: title as first line, then markdown body
    full_content = f"# {article.title}\n\n{article.content}"

    record = {
        "type": "text",
        "platform": "blog",
        "content": full_content,
        # Publish if score >= 0.5 (most articles are good enough)
        "status": "published" if critic_result.get("score", 0) >= 0.5 else "review",
        "performance": metadata,  # Using performance JSON field for metadata
    }

    try:
        result = supabase.table("content_calendar").insert(record).execute()
        if result.data:
            return result.data[0]
    except Exception as e:
        print(f"  [error] Supabase save failed: {e}")

    return None


# ============================================
# MAIN
# ============================================

async def run_blog_generator():
    """Main blog generation pipeline."""

    print("=" * 60)
    print("NovaClaw AI - Blog Generator Agent")
    print(f"Time: {datetime.utcnow().isoformat()}")
    print(f"Dry run: {DRY_RUN}")
    print("=" * 60)

    start_time = time.time()
    supabase = get_supabase()

    # Log start
    log_agent_action(supabase, "generator", "blog_generator_start", "running",
                     {"dry_run": DRY_RUN}, {})

    async with aiohttp.ClientSession() as session:
        # STEP 1: Scrape trends
        print("\n[1/5] Scraping AI trends...")
        trends = await scrape_ai_trends(session)
        print(f"  Found {len(trends)} AI-related trends")

        if not trends:
            print("  [error] No trends found. Exiting.")
            log_agent_action(supabase, "generator", "blog_generator_complete", "failed",
                             {}, {"error": "No trends found"}, "No trends scraped")
            return

        # STEP 2: Score trends
        print("\n[2/5] Scoring trends for blog-worthiness...")
        trends = await score_trends(trends, session)
        top_trend = trends[0]
        print(f"  Top trend: {top_trend.title[:80]} (score: {top_trend.relevance_score:.2f})")
        print(f"  Source: {top_trend.source}")

        # STEP 3: Generate articles (NL + EN)
        print("\n[3/5] Generating blog articles...")
        articles = []

        for lang in ["nl", "en"]:
            print(f"  Generating {lang.upper()} article...")
            article = await generate_blog_article(top_trend, lang, session)
            if article:
                articles.append(article)
                print(f"  ✓ {lang.upper()}: {article.title[:60]}")
            else:
                print(f"  ✗ Failed to generate {lang.upper()} article")

        if not articles:
            print("  [error] No articles generated. Exiting.")
            log_agent_action(supabase, "generator", "blog_generator_complete", "failed",
                             {"trend": top_trend.title}, {"error": "Generation failed"})
            return

        # STEP 4: Critic review
        print("\n[4/5] Critic reviewing articles...")
        reviewed = []
        for article in articles:
            critic = await review_article(article, session)
            score = critic.get("score", 0)
            status = "✓ Approved" if critic.get("approved") else "⚠ Needs review"
            print(f"  {status}: {article.lang.upper()} (score: {score:.2f}) — {critic.get('feedback', '')[:60]}")
            reviewed.append((article, critic))

        # STEP 5: Save to Supabase
        print("\n[5/5] Saving to database...")
        saved_count = 0

        if DRY_RUN:
            print("  [dry-run] Skipping database writes")
            for article, critic in reviewed:
                print(f"  Would save: {article.lang.upper()} — {article.title[:60]}")
                saved_count += 1
        else:
            for article, critic in reviewed:
                if critic.get("score", 0) >= 0.5:  # Save if score >= 0.5
                    result = save_blog_post(supabase, article, critic)
                    if result:
                        saved_count += 1
                        print(f"  ✓ Saved: {article.lang.upper()} — {article.slug}")
                    else:
                        print(f"  ✗ Failed to save: {article.lang.upper()}")
                else:
                    print(f"  ✗ Rejected (low score): {article.lang.upper()}")

    # Log completion
    duration = int((time.time() - start_time) * 1000)

    log_agent_action(supabase, "generator", "blog_generator_complete", "success",
                     {"trend": top_trend.title, "dry_run": DRY_RUN},
                     {
                         "trends_found": len(trends),
                         "articles_generated": len(articles),
                         "articles_saved": saved_count,
                     },
                     duration_ms=duration)

    print("\n" + "=" * 60)
    print(f"Blog Generator Complete!")
    print(f"Duration: {duration}ms")
    print(f"Articles saved: {saved_count}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_blog_generator())
