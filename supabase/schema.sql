-- ============================================
-- NOVACLAW AI - SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- LEADS TABLE
-- Captures all incoming leads from web forms
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(200),
    source VARCHAR(50) NOT NULL DEFAULT 'website',
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_source ON leads(source);

-- ============================================
-- CONTENT CALENDAR TABLE
-- Stores all generated and scheduled content
-- ============================================
CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'image', 'video', 'carousel')),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'twitter', 'blog', 'email')),
    title VARCHAR(200),
    content TEXT NOT NULL,
    media_url TEXT,
    media_metadata JSONB DEFAULT '{}',
    hashtags TEXT[],
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'failed', 'archived')),
    performance JSONB DEFAULT '{
        "impressions": 0,
        "engagement": 0,
        "clicks": 0,
        "shares": 0
    }',
    trend_source VARCHAR(200),
    generation_prompt TEXT,
    critic_score DECIMAL(3,2),
    critic_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for content queries
CREATE INDEX idx_content_status ON content_calendar(status);
CREATE INDEX idx_content_platform ON content_calendar(platform);
CREATE INDEX idx_content_scheduled ON content_calendar(scheduled_for);
CREATE INDEX idx_content_created ON content_calendar(created_at DESC);

-- ============================================
-- AGENT LOGS TABLE
-- Comprehensive logging for all agent activity
-- ============================================
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_type VARCHAR(30) NOT NULL
        CHECK (agent_type IN ('scraper', 'generator', 'critic', 'distributor', 'outreach', 'analytics')),
    action VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'running'
        CHECK (status IN ('running', 'success', 'failed', 'timeout')),
    input JSONB DEFAULT '{}',
    output JSONB DEFAULT '{}',
    error TEXT,
    duration_ms INTEGER,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    parent_log_id UUID REFERENCES agent_logs(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for log queries
CREATE INDEX idx_logs_agent_type ON agent_logs(agent_type);
CREATE INDEX idx_logs_status ON agent_logs(status);
CREATE INDEX idx_logs_created ON agent_logs(created_at DESC);
CREATE INDEX idx_logs_parent ON agent_logs(parent_log_id);

-- ============================================
-- TRENDS TABLE
-- Stores scraped trends for content generation
-- ============================================
CREATE TABLE IF NOT EXISTS trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    title VARCHAR(300) NOT NULL,
    url TEXT,
    summary TEXT,
    relevance_score DECIMAL(3,2),
    used_for_content BOOLEAN DEFAULT FALSE,
    content_id UUID REFERENCES content_calendar(id),
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_trends_source ON trends(source);
CREATE INDEX idx_trends_relevance ON trends(relevance_score DESC);
CREATE INDEX idx_trends_unused ON trends(used_for_content) WHERE used_for_content = FALSE;

-- ============================================
-- DISTRIBUTION QUEUE TABLE
-- Queue for content distribution
-- ============================================
CREATE TABLE IF NOT EXISTS distribution_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID REFERENCES content_calendar(id) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retry')),
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    error TEXT,
    external_post_id VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_queue_status ON distribution_queue(status);
CREATE INDEX idx_queue_scheduled ON distribution_queue(scheduled_for);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_queue ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for backend agents)
CREATE POLICY "Service role full access on leads"
    ON leads FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on content"
    ON content_calendar FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on logs"
    ON agent_logs FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on trends"
    ON trends FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on queue"
    ON distribution_queue FOR ALL
    USING (auth.role() = 'service_role');

-- Anon role can insert leads (for web form)
CREATE POLICY "Anon can insert leads"
    ON leads FOR INSERT
    WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER content_updated_at
    BEFORE UPDATE ON content_calendar
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_row leads)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Base score
    score := 10;

    -- Company provided
    IF lead_row.company IS NOT NULL AND lead_row.company != '' THEN
        score := score + 20;
    END IF;

    -- High-value sources
    IF lead_row.source IN ('referral', 'linkedin', 'demo_request') THEN
        score := score + 30;
    END IF;

    -- Engagement from metadata
    IF (lead_row.metadata->>'revisit_count')::INTEGER > 2 THEN
        score := score + 15;
    END IF;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-score leads
CREATE OR REPLACE FUNCTION auto_score_lead()
RETURNS TRIGGER AS $$
BEGIN
    NEW.score := calculate_lead_score(NEW);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_auto_score
    BEFORE INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION auto_score_lead();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- Enable for frontend live updates
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE content_calendar;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_logs;

-- ============================================
-- INITIAL SEED DATA (Optional)
-- ============================================
-- INSERT INTO content_calendar (type, platform, title, content, status)
-- VALUES ('text', 'linkedin', 'Welcome Post', 'NovaClaw AI is now live!', 'draft');
