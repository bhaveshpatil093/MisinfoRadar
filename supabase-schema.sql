-- Table 1: RSS Sources
CREATE TABLE IF NOT EXISTS rss_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'election_news', 'fact_checkers', 'mainstream_media'
  credibility_score DECIMAL(3,2) DEFAULT 0.50, -- 0.00 to 1.00
  is_active BOOLEAN DEFAULT true,
  last_fetched TIMESTAMPTZ,
  total_articles_fetched INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Content Items (Articles/Posts)
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES rss_sources(id),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL UNIQUE,
  published_at TIMESTAMPTZ,
  content_text TEXT,
  images JSONB, -- Array of image URLs
  videos JSONB, -- Array of video URLs
  keywords TEXT[],
  
  -- Scanning status
  scan_status TEXT DEFAULT 'pending', -- 'pending', 'scanning', 'completed', 'failed'
  scanned_at TIMESTAMPTZ,
  
  -- Classification results
  is_election_related BOOLEAN,
  is_misinformation BOOLEAN,
  misinformation_confidence DECIMAL(3,2), -- 0.00 to 1.00
  misinformation_type TEXT, -- 'deepfake', 'false_claim', 'misleading', 'satire', 'conspiracy'
  severity_level TEXT, -- 'low', 'medium', 'high', 'critical'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: Agent Activity Logs
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id),
  agent_name TEXT NOT NULL, -- 'monitor', 'detector', 'verifier', 'tracer', 'alerter', 'counter'
  action TEXT NOT NULL, -- 'scanned', 'detected', 'verified', 'traced', 'alerted', 'countered'
  details JSONB, -- Agent-specific details
  confidence_score DECIMAL(3,2),
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: Fact Checks
CREATE TABLE IF NOT EXISTS fact_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id),
  claim TEXT NOT NULL,
  
  -- Verification results
  verdict TEXT, -- 'true', 'false', 'misleading', 'unverified', 'satire'
  confidence DECIMAL(3,2),
  
  -- Supporting evidence
  supporting_sources JSONB, -- Array of {url, title, credibility, excerpt}
  contradicting_sources JSONB,
  
  -- Analysis
  reasoning TEXT,
  evidence_quality TEXT, -- 'strong', 'moderate', 'weak'
  
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: Source Traces
CREATE TABLE IF NOT EXISTS source_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id),
  
  -- Origin tracking
  original_source TEXT,
  first_seen_at TIMESTAMPTZ,
  spread_pattern TEXT, -- 'viral', 'coordinated', 'organic', 'bot_amplified'
  
  -- Network analysis
  sharing_accounts JSONB, -- Array of accounts that shared it
  geographic_spread JSONB, -- Countries/regions
  platform_distribution JSONB, -- Twitter, Facebook, WhatsApp, etc.
  
  -- Deepfake analysis (if applicable)
  is_deepfake BOOLEAN,
  deepfake_confidence DECIMAL(3,2),
  manipulation_type TEXT, -- 'face_swap', 'voice_clone', 'full_synthesis'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id),
  
  -- Alert details
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  alert_type TEXT NOT NULL, -- 'misinformation', 'deepfake', 'coordinated_campaign'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'acknowledged', 'resolved', 'false_positive'
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  
  -- Distribution
  sent_to JSONB, -- Array of recipients {type, address, sent_at, status}
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 7: Counter Narratives
CREATE TABLE IF NOT EXISTS counter_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id),
  alert_id UUID REFERENCES alerts(id),
  
  -- Counter content
  format TEXT NOT NULL, -- 'text', 'image', 'video', 'infographic'
  content TEXT NOT NULL,
  media_url TEXT,
  
  -- Distribution
  target_audience TEXT, -- 'general', 'young_voters', 'elderly', 'specific_region'
  distribution_channels TEXT[], -- ['twitter', 'facebook', 'whatsapp', 'website']
  
  -- Effectiveness
  reach_count INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  effectiveness_score DECIMAL(3,2),
  
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 8: System Metrics
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Performance metrics
  articles_scanned_today INTEGER DEFAULT 0,
  misinformation_detected_today INTEGER DEFAULT 0,
  alerts_sent_today INTEGER DEFAULT 0,
  average_processing_time_ms INTEGER,
  
  -- Agent health
  monitor_agent_status TEXT DEFAULT 'active',
  detector_agent_status TEXT DEFAULT 'active',
  verifier_agent_status TEXT DEFAULT 'active',
  tracer_agent_status TEXT DEFAULT 'active',
  alerter_agent_status TEXT DEFAULT 'active',
  counter_agent_status TEXT DEFAULT 'active',
  
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_items_scan_status ON content_items(scan_status);
CREATE INDEX IF NOT EXISTS idx_content_items_published_at ON content_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_severity ON content_items(severity_level);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_agent_logs_content_id ON agent_logs(content_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON agent_logs(agent_name);

-- Enable Row Level Security
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (allow read for authenticated users)
CREATE POLICY "Allow public read access" ON content_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agent_logs FOR SELECT USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to relevant tables
DROP TRIGGER IF EXISTS update_rss_sources_updated_at ON rss_sources;
CREATE TRIGGER update_rss_sources_updated_at BEFORE UPDATE ON rss_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed Data: Insert election-focused news sources
INSERT INTO rss_sources (name, url, category, credibility_score) VALUES
('BBC Politics', 'http://feeds.bbci.co.uk/news/politics/rss.xml', 'mainstream_media', 0.90),
('Reuters Politics', 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', 'mainstream_media', 0.92),
('The Hindu Politics', 'https://www.thehindu.com/news/national/feeder/default.rss', 'mainstream_media', 0.85),
('India Today Elections', 'https://www.indiatoday.in/rss/1206543', 'mainstream_media', 0.80),
('NDTV Elections', 'https://feeds.feedburner.com/ndtvnews-india-news', 'mainstream_media', 0.78),
('The Wire Politics', 'https://thewire.in/politics/feed', 'mainstream_media', 0.82),
('Alt News', 'https://www.altnews.in/feed/', 'fact_checkers', 0.95),
('Boom Live', 'https://www.boomlive.in/feed', 'fact_checkers', 0.93),
('FactCheck.org', 'https://www.factcheck.org/feed/', 'fact_checkers', 0.94),
('PolitiFact', 'https://www.politifact.com/rss/all/', 'fact_checkers', 0.93)
ON CONFLICT (url) DO NOTHING;

