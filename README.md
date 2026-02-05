# 🦞 NovaClaw AI

> Million Dollar Agency Infrastructure — $0 Budget

Autonomous marketing intelligence platform built entirely on free-tier services.

---

## 🚀 60-MINUTE DEPLOYMENT CHECKLIST

### Prerequisites
- GitHub account
- Vercel account (free)
- Supabase account (free)
- Anthropic API key (for Claude)

---

## PHASE 1: SUPABASE SETUP (15 min)

```bash
# 1. Go to supabase.com and create new project
# 2. Wait for project to initialize (~2 min)
# 3. Go to SQL Editor and run the schema:
```

Copy contents of `supabase/schema.sql` into Supabase SQL Editor → Run

```bash
# 4. Get your credentials from Project Settings > API:
#    - Project URL (NEXT_PUBLIC_SUPABASE_URL)
#    - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
#    - service_role key (SUPABASE_SERVICE_ROLE_KEY)
```

---

## PHASE 2: LOCAL SETUP & TESTING (20 min)

```bash
# Clone/init the project
git clone <your-repo-url> novaclaw-ai
cd novaclaw-ai

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase + Anthropic keys

# Run development server
npm run dev

# Open http://localhost:3000
```

**Test Checklist:**
- [ ] Homepage loads with 3D animation
- [ ] Lead form submits successfully
- [ ] Chat widget opens and responds
- [ ] Check Supabase → leads table has your test entry

---

## PHASE 3: GITHUB SETUP (10 min)

```bash
# Initialize git and push
git init
git add .
git commit -m "Initial NovaClaw AI setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/novaclaw-ai.git
git push -u origin main
```

**Add GitHub Secrets** (Settings → Secrets and variables → Actions):

| Secret Name | Value |
|-------------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your service_role key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

---

## PHASE 4: VERCEL DEPLOYMENT (10 min)

```bash
# Option 1: Via CLI
npm i -g vercel
vercel

# Option 2: Via Dashboard
# Go to vercel.com → Import Git Repository
```

**Vercel Environment Variables** (Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key |
| `ANTHROPIC_API_KEY` | Your Anthropic key |
| `AGENT_CRON_SECRET` | Generate: `openssl rand -hex 32` |

---

## PHASE 5: ACTIVATE AGENTS (5 min)

**Test the Content Loop manually:**

1. Go to GitHub → Actions tab
2. Select "🤖 Content Loop Agent"
3. Click "Run workflow"
4. Watch the logs

**Verify in Supabase:**
- Check `agent_logs` table for entries
- Check `content_calendar` for generated content
- Check `trends` for scraped trends

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (Edge Runtime)                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Next.js 14 App                                         ││
│  │  ├── Hero.tsx (Glassmorphism + Lead Capture)           ││
│  │  ├── AgentChat.tsx (Real-time AI Chat)                 ││
│  │  ├── ParticleField.tsx (3D Background)                 ││
│  │  └── API Routes (/leads, /chat, /agent-status)         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE (Free Tier)                     │
│  ├── leads (Lead capture + scoring)                         │
│  ├── content_calendar (Generated content)                   │
│  ├── agent_logs (Agent activity tracking)                   │
│  ├── trends (Scraped trend data)                           │
│  └── Realtime subscriptions                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS (Cron: */12h)                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Scraper   │→ │ Generator  │→ │   Critic   │            │
│  │  Agent     │  │   Agent    │  │   Agent    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│        │               │               │                    │
│        ▼               ▼               ▼                    │
│  ┌──────────────────────────────────────────┐              │
│  │           Distribution Agent             │              │
│  │  (Webhooks → LinkedIn/IG/Twitter)       │              │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ├── Claude API (Haiku for cost efficiency)                 │
│  ├── Pollinations.ai (FREE image generation)                │
│  └── Buffer Free Tier / Direct Webhooks                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 SECURITY HARDENING

### API Keys Protection
All secrets stored in:
- **GitHub Secrets** (for Actions)
- **Vercel Environment Variables** (encrypted at rest)
- Never committed to code

### Edge Runtime Benefits
- No cold starts
- Keys never exposed to client
- Rate limiting built-in

### Supabase RLS
- Row Level Security enabled on all tables
- Service role for backend only
- Anon role limited to lead insertion

---

## 💰 FREE TIER LIMITS

| Service | Free Tier Limit | Our Usage |
|---------|-----------------|-----------|
| **Vercel** | 100GB bandwidth, 100k serverless calls | ~5-10% |
| **Supabase** | 500MB DB, 2GB bandwidth, 50k requests | ~10-20% |
| **GitHub Actions** | 2000 min/month | ~60 min (2 runs/day) |
| **Pollinations.ai** | Unlimited | ✓ |
| **Anthropic** | Pay-per-use (Haiku = $0.25/1M tokens) | ~$2-5/month |

---

## 📁 PROJECT STRUCTURE

```
novaclaw-ai/
├── app/
│   ├── api/
│   │   ├── leads/route.ts      # Lead capture endpoint
│   │   ├── chat/route.ts       # Claude chat proxy
│   │   └── agent-status/route.ts
│   ├── globals.css             # Glassmorphism styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── Hero.tsx                # Main hero + lead form
│   ├── AgentChat.tsx           # Chat widget
│   └── three/
│       └── ParticleField.tsx   # 3D background
├── lib/
│   ├── supabase.ts             # DB client + types
│   └── utils.ts                # Utilities
├── agents/
│   ├── content_loop.py         # Main agent script
│   └── requirements.txt        # Python deps
├── supabase/
│   └── schema.sql              # Database schema
├── .github/workflows/
│   └── content-loop.yml        # Cron automation
└── [config files]
```

---

## 🔧 COMMANDS REFERENCE

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run linter

# Agent (local testing)
cd agents
pip install -r requirements.txt
python content_loop.py

# Database
# Run schema.sql in Supabase SQL Editor

# Deployment
vercel                   # Deploy to Vercel
git push origin main     # Triggers auto-deploy
```

---

## 🎯 NEXT STEPS

1. **Add Distribution Integrations**
   - LinkedIn API (requires app approval)
   - Buffer API (free tier)
   - Zapier webhooks

2. **Enhance Agents**
   - Add sentiment analysis
   - A/B testing variants
   - Performance feedback loop

3. **Scale**
   - Add more RSS sources
   - Multi-language support
   - Custom brand voice training

---

## 📜 LICENSE

MIT License - Build your million-dollar agency.

---

**Built with 🦞 by NovaClaw AI**
