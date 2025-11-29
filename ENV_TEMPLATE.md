# Environment Variables Template

Create a `.env.local` file in the root directory with the following variables:

```bash
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ============================================
# AI API KEYS
# ============================================
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_key

# ============================================
# SOCIAL MEDIA API KEYS
# ============================================
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
YOUTUBE_API_KEY=your_youtube_api_key

# ============================================
# FACT CHECKING API
# ============================================
GOOGLE_FACTCHECK_API_KEY=your_google_factcheck_key

# ============================================
# AI MODEL CONFIGURATION
# ============================================
OPENAI_MODEL_NAME=gpt-4-turbo-preview
GROQ_MODEL_NAME=llama-3.3-70b-versatile
OPENAI_TEMPERATURE=0.3
GROQ_TEMPERATURE=0.1
GROQ_MAX_TOKENS=10
COUNTER_AGENT_TEMPERATURE=0.7

# ============================================
# AGENT CONFIGURATION
# ============================================
MONITOR_SCAN_INTERVAL_MS=300000
MONITOR_BATCH_SIZE=50
DEEPFAKE_ENGAGEMENT_THRESHOLD=0.01
DEEPFAKE_VIEW_THRESHOLD=10000
VIRAL_ENGAGEMENT_THRESHOLD=1000
BOT_AMPLIFICATION_THRESHOLD=20
BOT_ENGAGEMENT_RATIO=10
COORDINATED_TWEET_THRESHOLD=5

# ============================================
# RSS CONFIGURATION
# ============================================
RSS_FEED_LIMIT=12
RSS_ITEMS_PER_SOURCE=2

# ============================================
# SOCIAL MEDIA LIMITS
# ============================================
YOUTUBE_SEARCH_LIMIT=5
TWITTER_SEARCH_LIMIT=10
TWITTER_INDIA_WOEID=23424848
TWITTER_WORLDWIDE_WOEID=1

# ============================================
# ANALYSIS THRESHOLDS
# ============================================
ANALYSIS_BASE_SCORE=0.35
ANALYSIS_DEEPFAKE_SCORE=0.25
ANALYSIS_HYPE_SCORE=0.1
ANALYSIS_CREDIBILITY_SCORE=0.15
ANALYSIS_SUSPICIOUS_TERMS_THRESHOLD=3
ANALYSIS_MIN_SCORE=0.05
ANALYSIS_MAX_SCORE=0.95
ANALYSIS_VERDICT_THRESHOLD=0.6

# ============================================
# REGION CONFIGURATION
# ============================================
DEFAULT_REGION=Maharashtra
DEFAULT_COUNTRY=India

# ============================================
# OPTIONAL CONFIGURATION
# ============================================
N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting API Keys

1. **Supabase**: 
   - Go to https://supabase.com
   - Create a new project
   - Go to Settings > API
   - Copy the URL and anon key

2. **OpenAI**: 
   - Go to https://platform.openai.com/api-keys
   - Create a new API key

3. **Groq**: 
   - Go to https://console.groq.com
   - Create an API key

4. **Hugging Face** (optional):
   - Go to https://huggingface.co/settings/tokens
   - Create a new token

