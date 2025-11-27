export type RSSSource = {
  id: string
  name: string
  url: string
  category: 'election_news' | 'fact_checkers' | 'mainstream_media'
  credibility_score: number
  is_active: boolean
  last_fetched: string | null
  total_articles_fetched: number
  created_at: string
  updated_at: string
}

export type ContentItem = {
  id: string
  source_id: string
  title: string
  description: string | null
  url: string
  published_at: string | null
  content_text: string | null
  images: string[] | null
  videos: string[] | null
  keywords: string[] | null
  scan_status: 'pending' | 'scanning' | 'completed' | 'failed'
  scanned_at: string | null
  is_election_related: boolean | null
  is_misinformation: boolean | null
  misinformation_confidence: number | null
  misinformation_type: string | null
  severity_level: 'low' | 'medium' | 'high' | 'critical' | null
  created_at: string
  updated_at: string
}

export type AgentLog = {
  id: string
  content_id: string | null
  agent_name: 'monitor' | 'detector' | 'verifier' | 'tracer' | 'alerter' | 'counter'
  action: string
  details: any
  confidence_score: number | null
  processing_time_ms: number | null
  created_at: string
}

export type FactCheck = {
  id: string
  content_id: string
  claim: string
  verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'satire' | null
  confidence: number | null
  supporting_sources: any[] | null
  contradicting_sources: any[] | null
  reasoning: string | null
  evidence_quality: 'strong' | 'moderate' | 'weak' | null
  verified_at: string
  created_at: string
}

export type SourceTrace = {
  id: string
  content_id: string
  original_source: string | null
  first_seen_at: string | null
  spread_pattern: string | null
  sharing_accounts: any[] | null
  geographic_spread: any[] | null
  platform_distribution: any[] | null
  is_deepfake: boolean | null
  deepfake_confidence: number | null
  manipulation_type: string | null
  created_at: string
}

export type Alert = {
  id: string
  content_id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  alert_type: string
  title: string
  message: string
  status: 'active' | 'acknowledged' | 'resolved' | 'false_positive'
  acknowledged_by: string | null
  acknowledged_at: string | null
  sent_to: any[] | null
  created_at: string
  updated_at: string
}

export type CounterNarrative = {
  id: string
  content_id: string
  alert_id: string | null
  format: 'text' | 'image' | 'video' | 'infographic'
  content: string
  media_url: string | null
  target_audience: string | null
  distribution_channels: string[] | null
  reach_count: number
  engagement_count: number
  effectiveness_score: number | null
  published_at: string | null
  created_at: string
}

export type SystemMetrics = {
  id: string
  articles_scanned_today: number
  misinformation_detected_today: number
  alerts_sent_today: number
  average_processing_time_ms: number | null
  monitor_agent_status: string
  detector_agent_status: string
  verifier_agent_status: string
  tracer_agent_status: string
  alerter_agent_status: string
  counter_agent_status: string
  date: string
  created_at: string
}

