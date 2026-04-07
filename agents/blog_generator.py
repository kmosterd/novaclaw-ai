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
Meer dan 18 agent types: Klantenservice, Voice, Chatbot, Helpdesk, Content, SEO & AIO,
Email Marketing, Social Media, Ads & Campaign, Lead Generation, Appointment Setter,
E-commerce, Automation, Data & Analytics, Data Entry, Compliance, Web Scraping, Custom.
Tech-agnostisch: OpenAI GPT-4o, Anthropic Claude, Google Gemini, Meta Llama.

EIGEN PRODUCTEN VAN NOVACLAW:
- OpenClaw: De persoonlijke AI-communicatie-agent van NovaClaw. Beantwoordt klantvragen,
  kwalificeert leads, plant afspraken en onderhoudt klantrelaties. 24/7 actief, volledig
  getraind op het merk van de klant, integreert met WhatsApp, e-mail en CRM. GDPR-compliant.
  OpenClaw IS een product van NovaClaw.

TECHNOLOGIE DIE NOVACLAW INZET (NIET eigendom van NovaClaw):
- NemoClaw / NVIDIA NeMo: Dit is een product en framework van NVIDIA, NIET van NovaClaw.
  NovaClaw gebruikt NVIDIA NeMo/NemoClaw om Personal Assistance AI te bouwen voor klanten.
  Schrijf nooit dat NemoClaw een product van NovaClaw is. NovaClaw is gebruiker, niet eigenaar.

Website: novaclaw.tech | Email: info@novaclaw.tech
"""

# Hard factual boundaries — used by the fact-checker to detect hallucinations.
# Add new facts here when product/partnership details change.
KNOWN_FACTS = [
    "OpenClaw IS een product van NovaClaw.",
    "NemoClaw / NVIDIA NeMo is een product van NVIDIA, NIET van NovaClaw.",
    "NovaClaw heeft NemoClaw NIET uitgevonden en bezit het NIET.",
    "NovaClaw gebruikt NVIDIA NeMo/NemoClaw als technologie om Personal Assistance AI te bouwen.",
    "NovaClaw is een Nederlands AI agency (niet Belgisch, niet Duits, niet Amerikaans).",
    "NovaClaw biedt meer dan 18 agent-types aan.",
    "NovaClaw is tech-agnostisch: OpenAI GPT-4o, Anthropic Claude, Google Gemini, Meta Llama.",
    "NovaClaw website: novaclaw.tech",
]

# Rotating product topics for dedicated articles.
# OpenClaw topics: describe NovaClaw's own product.
# NemoClaw topics: describe NVIDIA's NeMo framework and how NovaClaw uses it for clients.
PRODUCT_TOPICS = [
    {
        "title": "OpenClaw: hoe een AI klantenservice-agent jouw bedrijf 24/7 bereikbaar maakt",
        "summary": "OpenClaw is de AI-communicatie-agent van NovaClaw die klantvragen beantwoordt, leads kwalificeert en afspraken plant. Voordelen, werking en ROI.",
        "source": "novaclaw_product",
        "category": "product",
    },
    {
        "title": "NVIDIA NeMo uitgelegd: hoe NovaClaw dit framework inzet voor Personal Assistance AI",
        "summary": "NVIDIA NeMo (ook wel NemoClaw) is een krachtig AI-framework van NVIDIA. NovaClaw gebruikt het om op maat gemaakte Personal Assistance AI te bouwen voor klanten. Wat is NeMo en wat zijn de voordelen?",
        "source": "novaclaw_product",
        "category": "AI Agents",
    },
    {
        "title": "OpenClaw vs. een menselijke klantenservice: wat levert meer op?",
        "summary": "Vergelijking tussen een AI klantenservice-agent (OpenClaw van NovaClaw) en een menselijk team. Kosten, snelheid, klanttevredenheid en wanneer te combineren.",
        "source": "novaclaw_product",
        "category": "product",
    },
    {
        "title": "Wat is NVIDIA NeMo en waarom gebruiken AI-bureaus het voor Personal Assistance AI?",
        "summary": "NVIDIA NeMo is een enterprise AI-framework voor het bouwen van conversationele en autonome AI. NovaClaw zet NeMo in als technologiebasis voor Personal Assistance AI-oplossingen.",
        "source": "novaclaw_product",
        "category": "AI Trends",
    },
    {
        "title": "OpenClaw integreren met WhatsApp Business: stap-voor-stap",
        "summary": "Hoe je OpenClaw (de AI-agent van NovaClaw) koppelt aan WhatsApp Business voor automatische klantenservice. Technische uitleg en praktijkvoorbeelden.",
        "source": "novaclaw_product",
        "category": "product",
    },
    {
        "title": "NVIDIA NeMo vs. andere AI-frameworks: waarom NovaClaw kiest voor enterprise-grade AI",
        "summary": "Vergelijking van NVIDIA NeMo met alternatieven. Hoe NovaClaw het NeMo-framework inzet om betrouwbare, schaalbare Personal Assistance AI te bouwen voor Nederlandse bedrijven.",
        "source": "novaclaw_product",
        "category": "AI Trends",
    },
]


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
# FACT-CHECKER AGENT
# ============================================

async def fact_check_article(
    article: BlogArticle,
    session: aiohttp.ClientSession
) -> Dict[str, Any]:
    """
    Dedicated fact-checker that verifies the article against KNOWN_FACTS.
    Returns {"passed": bool, "violations": [...], "verdict": "..."}.
    If violations are found, the article should NOT be auto-published.
    """

    if not ANTHROPIC_API_KEY:
        return {"passed": True, "violations": [], "verdict": "No API key — skipped"}

    facts_block = "\n".join(f"- {f}" for f in KNOWN_FACTS)

    prompt = f"""You are a strict fact-checker for NovaClaw, a Dutch AI agency.
Your job is to detect factual errors in blog articles before publication.

KNOWN FACTS (these are absolute truths — never contradict them):
{facts_block}

ARTICLE TO CHECK:
Title: {article.title}
Language: {article.lang}
Content (first 1500 chars):
{article.content[:1500]}

INSTRUCTIONS:
1. Read the article carefully.
2. Check every claim against the KNOWN FACTS list.
3. Flag any sentence that contradicts a known fact (e.g. calling NemoClaw a NovaClaw product).
4. Also flag vague claims like "NovaClaw's NemoClaw" or "our NemoClaw" that imply ownership.
5. Do NOT flag generic AI claims that are not covered by KNOWN FACTS.

Return JSON:
{{
  "passed": true or false,
  "violations": ["exact quote from article that is wrong", ...],
  "verdict": "one sentence summary"
}}

If no violations found, return {{"passed": true, "violations": [], "verdict": "No factual errors found."}}"""

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
                "max_tokens": 500,
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
                print(f"  [warn] Fact-checker error: {response.status}")
    except Exception as e:
        print(f"  [warn] Fact-checker failed: {e}")

    # On failure: flag for manual review (do not auto-publish)
    return {"passed": False, "violations": [], "verdict": "Fact-checker unavailable — flagged for review"}


# ============================================
# UNSPLASH FEATURED IMAGES
# ============================================

# Curated Unsplash photo IDs mapped to common blog topics
# Multiple photos per category so no two articles get the same image
UNSPLASH_IMAGES = {
    "ai": [
        "photo-1677442136019-21780ecad995",  # AI brain visualization
        "photo-1684369175833-4b445ad6bfb5",  # Neural network blue
        "photo-1655720828018-edd2daec9349",  # AI chip abstract
        "photo-1696258686454-60082b2c33e2",  # Futuristic AI interface
        "photo-1507146153580-69a1fe6d8aa1",  # Abstract neural connections
        "photo-1636690513351-0af1763f6571",  # AI processor glow
        "photo-1620825937374-87fc7d6bddc2",  # Digital brain network
        "photo-1589254065878-42c014109b33",  # Machine learning diagram
        "photo-1535930749574-1399327ce78f",  # Futuristic technology
        "photo-1527474305167-d09807e31c5f",  # Sci-fi circuit board
    ],
    "security": [
        "photo-1555949963-ff9fe0c870eb",  # Cybersecurity lock
        "photo-1614064641938-3bbee52942c7",  # Shield digital
        "photo-1550751827-4bd374c3f58b",  # Security padlock
        "photo-1510511459019-5dda7724fd87",  # Fingerprint scan
        "photo-1563013544-824ae1b704d3",  # Encrypted data stream
        "photo-1558494949-ef010cbdcc31",  # Security monitoring
        "photo-1526374965328-7f61d4dc18c5",  # Matrix code green
        "photo-1562813733-b31f71025d54",  # Cyber defense
        "photo-1667372393086-9d4001d51cf1",  # Digital shield glow
        "photo-1633265486064-086b219458ec",  # Cybersecurity dashboard
    ],
    "automation": [
        "photo-1485827404703-89b55fcc595e",  # Abstract tech lines
        "photo-1518432031352-d6fc5c10da5a",  # Code automation
        "photo-1551434678-e076c223a692",  # Team workflow
        "photo-1581091226825-a6a2a5aee158",  # Robot arm industry
        "photo-1563203369-26f2e4a5ccf7",  # Gears mechanism
        "photo-1537498425277-c283d32ef9db",  # Smart factory
        "photo-1558346490-a72e53ae2d4f",  # Workflow automation
        "photo-1504384308090-c894fdcc538d",  # Circuit board macro
        "photo-1573164713988-8665fc963095",  # Robotic automation
        "photo-1531746790095-e5992cbe43ac",  # Industrial robotics
    ],
    "business": [
        "photo-1552664730-d307ca884978",  # Business meeting
        "photo-1542744173-8e7e53415bb0",  # Conference room
        "photo-1556761175-5973dc0f32e7",  # Startup team
        "photo-1454165804606-c3d57bc86b40",  # Business desk laptop
        "photo-1521737711867-e3b97375f902",  # Office teamwork
        "photo-1560472355-536de3962603",  # Business handshake
        "photo-1522071820081-009f0129c71c",  # Team collaboration
        "photo-1553028826-f4804a6dba3b",  # Strategy planning
        "photo-1497366216548-37526070297c",  # Modern office
        "photo-1559136555-9303baea8ebd",  # Business growth
    ],
    "marketing": [
        "photo-1533750349088-cd871a92f312",  # Digital marketing
        "photo-1557838923-2985c318be48",  # Social media phone
        "photo-1432888622747-4eb9a8efeb07",  # Creative strategy
        "photo-1611926653458-09294b3142bf",  # Social media icons
        "photo-1563986768609-322da13575f2",  # Marketing analytics
        "photo-1571721795195-a2ca2d3370a9",  # Email notification
        "photo-1562577309-4932fdd64cd1",  # Content planning
        "photo-1572044162444-ad60f128bdea",  # Campaign strategy
        "photo-1565106430482-8f6e74349ca1",  # Digital advertising
        "photo-1551836022-d5d88e9218df",  # Marketing meeting
    ],
    "seo": [
        "photo-1432888498266-38ffec3eaf0a",  # SEO/search desk
        "photo-1553877522-43269d4ea984",  # Google search
        "photo-1571844307880-751c6d86f3f3",  # Search magnifying glass
        "photo-1562577308-9e66f0c65ce5",  # Analytics overview
        "photo-1542903660-eedba2cda473",  # Keyword research
        "photo-1516321318423-f06f85e504b3",  # Web analytics
        "photo-1460925895917-afdab827c52f",  # SEO dashboard
        "photo-1559028012-481c04fa702d",  # Search engine ranking
        "photo-1517292987719-0369a794ec0f",  # Organic growth
        "photo-1556155092-490a1ba16284",  # Website optimization
    ],
    "data": [
        "photo-1551288049-bebda4e38f71",  # Data analytics
        "photo-1543286386-713bdd548da4",  # Dashboard charts
        "photo-1509228468518-180dd4864904",  # Server room
        "photo-1504868584819-f8e8b4b6d7e3",  # Data visualization
        "photo-1518186285589-2f7649de83e0",  # Digital data grid
        "photo-1558494949-ef010cbdcc31",  # Data center
        "photo-1544197150-b99a580bb7a8",  # Analytics graphs
        "photo-1527474305167-d09807e31c5f",  # Data network
        "photo-1563986768494-4dee2763ff3f",  # Database infrastructure
        "photo-1504639725590-34d0984388bd",  # Data processing
    ],
    "content": [
        "photo-1499750310107-5fef28a66643",  # Content creation desk
        "photo-1455390582262-044cdead277a",  # Writing workspace
        "photo-1488190211105-8b0e65b80b4e",  # Blogging setup
        "photo-1519389950473-47ba0277781c",  # Creative office
        "photo-1471107340929-a87cd0f5b5f3",  # Laptop content
        "photo-1542435503-956c469947f6",  # Notepad writing
        "photo-1456324504439-367cee3b3c32",  # Creative workspace
        "photo-1501504905252-473c47e087f8",  # Book and laptop
        "photo-1586281380349-632531db7ed4",  # Editorial desk
        "photo-1520971081497-30c9448c8899",  # Storytelling
    ],
    "agents": [
        "photo-1620712943543-bcc4688e7485",  # Robot/AI agent
        "photo-1535378917042-10a22c95931a",  # Abstract tech
        "photo-1531482615713-2afd69097998",  # Chatbot concept
        "photo-1676299081847-824916de030a",  # AI assistant
        "photo-1485827404703-89b55fcc595e",  # Tech agent abstract
        "photo-1596348158371-d3a25ec4dcf4",  # Virtual assistant
        "photo-1639322537228-f710d846310a",  # Conversational AI
        "photo-1616161560417-66d4db5892ec",  # AI robot face
        "photo-1634017839464-5c339eba3df4",  # Chatbot interface
        "photo-1593376893114-1aed528d80cf",  # Digital assistant
    ],
    "coding": [
        "photo-1461749280684-dccba630e2f6",  # Code on screen
        "photo-1555066931-4365d14bab8c",  # Code IDE dark
        "photo-1498050108023-c5249f4df085",  # Developer laptop
        "photo-1587620962725-abab7fe55159",  # Code close-up
        "photo-1515879218367-8466d910aede",  # Terminal window
        "photo-1542831371-29b0f74f9713",  # JavaScript code
        "photo-1607799279861-4dd421887fb3",  # GitHub coding
        "photo-1544256718-3bcf237f3974",  # Dark mode code
        "photo-1580894894513-541e068a3e2b",  # Programming setup
        "photo-1534665482403-a909d0d97c67",  # Developer workspace
    ],
}


def get_unsplash_image(article: "BlogArticle") -> str:
    """Pick a relevant and unique Unsplash image based on article tags, category and slug."""
    text = " ".join(article.tags + [article.category]).lower()

    if any(w in text for w in ["security", "veiligheid", "privacy", "gdpr", "compliance"]):
        key = "security"
    elif any(w in text for w in ["seo", "aio", "search", "zoek", "vindbaarheid"]):
        key = "seo"
    elif any(w in text for w in ["marketing", "email", "social media", "ads"]):
        key = "marketing"
    elif any(w in text for w in ["automation", "automatisering", "workflow"]):
        key = "automation"
    elif any(w in text for w in ["data", "analytics", "dashboard"]):
        key = "data"
    elif any(w in text for w in ["content", "blog", "schrijven", "writing"]):
        key = "content"
    elif any(w in text for w in ["code", "coding", "developer", "programming", "api"]):
        key = "coding"
    elif any(w in text for w in ["agent", "chatbot", "assistant"]):
        key = "agents"
    elif any(w in text for w in ["business", "bedrijf", "mkb", "enterprise", "startup"]):
        key = "business"
    elif any(w in text for w in ["ai", "artificial intelligence", "machine learning", "llm"]):
        key = "ai"
    else:
        key = "ai"

    photos = UNSPLASH_IMAGES[key]
    # Use a proper hash for better distribution across the pool
    import hashlib
    slug_hash = int(hashlib.md5(article.slug.encode()).hexdigest(), 16)
    photo_id = photos[slug_hash % len(photos)]
    return f"https://images.unsplash.com/{photo_id}?w=1200&h=630&fit=crop"


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

    # Pick a relevant Unsplash featured image
    featured_image = get_unsplash_image(article)

    record = {
        "type": "text",
        "platform": "blog",
        "content": full_content,
        # Publish if score >= 0.5 (most articles are good enough)
        "status": "published" if critic_result.get("score", 0) >= 0.5 else "review",
        "performance": metadata,  # Using performance JSON field for metadata
        "media_url": featured_image,
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
        scored_top = trends[0]

        # Every 3rd day: use a rotating OpenClaw/NemoClaw product topic
        day_of_year = datetime.utcnow().timetuple().tm_yday
        if day_of_year % 3 == 0:
            product_idx = (day_of_year // 3) % len(PRODUCT_TOPICS)
            product_topic = PRODUCT_TOPICS[product_idx]
            top_trend = Trend(
                source=product_topic["source"],
                category=product_topic["category"],
                title=product_topic["title"],
                url="https://novaclaw.tech",
                summary=product_topic["summary"],
                relevance_score=0.95,
            )
            print(f"  [product] Using dedicated product topic (day {day_of_year})")
        else:
            top_trend = scored_top

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
        print("\n[4/6] Critic reviewing articles...")
        reviewed = []
        for article in articles:
            critic = await review_article(article, session)
            score = critic.get("score", 0)
            status = "✓ Approved" if critic.get("approved") else "⚠ Needs review"
            print(f"  {status}: {article.lang.upper()} (score: {score:.2f}) — {critic.get('feedback', '')[:60]}")
            reviewed.append((article, critic))

        # STEP 5: Fact-check articles
        print("\n[5/6] Fact-checking articles for hallucinations...")
        fact_checked = []
        for article, critic in reviewed:
            fc = await fact_check_article(article, session)
            if fc.get("passed"):
                print(f"  ✓ Fact-check passed: {article.lang.upper()} — {fc.get('verdict', '')[:80]}")
            else:
                violations = fc.get("violations", [])
                print(f"  ✗ Fact-check FAILED: {article.lang.upper()} — {fc.get('verdict', '')[:80]}")
                for v in violations:
                    print(f"      Violation: {v[:120]}")
                # Force score below publish threshold so it goes to review
                critic = {**critic, "score": 0.0, "approved": False,
                          "feedback": f"[FACT-CHECK FAILED] {fc.get('verdict', '')}"}
            fact_checked.append((article, critic, fc))

        # STEP 6: Save to Supabase
        print("\n[6/6] Saving to database...")
        saved_count = 0

        if DRY_RUN:
            print("  [dry-run] Skipping database writes")
            for article, critic, fc in fact_checked:
                tag = "FACT-FAIL" if not fc.get("passed") else "OK"
                print(f"  Would save [{tag}]: {article.lang.upper()} — {article.title[:60]}")
                saved_count += 1
        else:
            for article, critic, fc in fact_checked:
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
