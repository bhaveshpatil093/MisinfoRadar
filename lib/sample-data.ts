export const sampleMetrics = {
  scannedToday: 128,
  misinfoDetected: 27,
  activeAlerts: 6,
  verificationRate: 78.5,
}

export const sampleAgentLogs = [
  {
    id: 'log-1',
    agent_name: 'monitor',
    action: 'scan_completed',
    details: { items_found: 42, region: 'Maharashtra' },
    confidence_score: null,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'log-2',
    agent_name: 'detector',
    action: 'misinformation_flagged',
    details: {
      headline: 'Viral post claims bogus EVMs in Pune',
      severity: 'high',
      confidence: 0.84,
    },
    confidence_score: 0.84,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'log-3',
    agent_name: 'verifier',
    action: 'verified',
    details: {
      claim: 'Mumbai voter turnout dropped to 20%',
      verdict: 'false',
      sources: ['ECI bulletin', 'Mumbai Mirror'],
    },
    confidence_score: 0.91,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'log-4',
    agent_name: 'tracer',
    action: 'traced',
    details: {
      origin: 'WhatsApp forwards in Aurangabad',
      spread_pattern: 'coordinated',
    },
    confidence_score: null,
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'log-5',
    agent_name: 'alerter',
    action: 'alerted',
    details: {
      severity: 'critical',
      title: 'Deepfake audio targeting Kolhapur candidates',
    },
    confidence_score: 0.76,
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'log-6',
    agent_name: 'counter',
    action: 'countered',
    details: {
      campaign: '#VoteMaharashtra',
      format: 'infographic',
    },
    confidence_score: null,
    created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
]

export const sampleAlerts = [
  {
    id: 'alert-1',
    severity: 'critical',
    alert_type: 'deepfake',
    title: 'Deepfake video claims CM resigned before polls',
    message:
      'Manipulated clip targeting Mumbai voters detected on Telegram and Instagram.',
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'alert-2',
    severity: 'high',
    alert_type: 'misinformation',
    title: 'False message about phased voting dates in Pune',
    message:
      'Whatsapp forwards circulating wrong dates for the Pune constituency.',
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'alert-3',
    severity: 'medium',
    alert_type: 'coordinated_campaign',
    title: 'Hashtag campaign amplifying bot narratives in Nagpur',
    message:
      'Over 300 suspect accounts pushing identical messaging about EVM tampering.',
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
]

export const sampleContentItems = [
  {
    id: 'content-1',
    title: 'Viral clip claims EVMs pre-loaded in Thane warehouse',
    description:
      'A low-quality video alleges sealed EVMs were tampered with before dispatch.',
    url: 'https://example.com/news/thane-evm-claim',
    created_at: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    scan_status: 'completed',
    is_misinformation: true,
    severity_level: 'high',
    misinformation_confidence: 0.82,
    is_election_related: true,
    description_details: 'Focus on Kalyan-Dombivli municipal storage hub.',
    misinformation_type: 'false_claim',
  },
  {
    id: 'content-2',
    title: 'Audio clip alleges Satara candidate switched parties secretly',
    description:
      'Circulating audio claims a prominent Satara leader will support rival alliance.',
    url: 'https://example.com/news/satara-audio',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    scan_status: 'completed',
    is_misinformation: true,
    severity_level: 'medium',
    misinformation_confidence: 0.74,
    is_election_related: true,
    misinformation_type: 'conspiracy',
  },
  {
    id: 'content-3',
    title: 'Post says Kolhapur rural voters removed from rolls',
    description:
      'Facebook post alleges 50k Kolhapur voters removed to favour rival party.',
    url: 'https://example.com/news/kolhapur-rolls',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    scan_status: 'completed',
    is_misinformation: true,
    severity_level: 'high',
    misinformation_confidence: 0.79,
    is_election_related: true,
    misinformation_type: 'false_claim',
  },
  {
    id: 'content-4',
    title: 'Fact-check: Viral claim about Mumbai police seizing ballot boxes',
    description:
      'Detector agent flagged, Verifier confirmed the incident never happened.',
    url: 'https://example.com/news/mumbai-police-clarification',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    scan_status: 'completed',
    is_misinformation: false,
    severity_level: 'low',
    misinformation_confidence: 0.21,
    is_election_related: true,
    misinformation_type: 'authentic',
  },
]

