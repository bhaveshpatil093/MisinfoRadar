# Dynamic Setup Guide

All components have been updated to use real API calls instead of sample data. Here's what you need to know:

## ✅ Changes Made

### 1. **Removed All Sample Data**
- ❌ No more dummy/sample data fallbacks
- ✅ All components now fetch from Supabase database
- ✅ Real-time updates via Supabase subscriptions
- ✅ Auto-refresh every 30 seconds for metrics

### 2. **Updated Components**
- ✅ `LiveMetrics` - Fetches real metrics from database
- ✅ `AgentActivityFeed` - Shows real agent logs
- ✅ `AlertCard` - Displays real alerts
- ✅ `ContentCard` - Shows real content items
- ✅ `ElectionTicker` - Displays real political misinformation

### 3. **Fixed Metrics Queries**
- Fixed date filtering to show all-time data if today is empty
- Improved error handling
- Better fallback logic

## 🔑 Required API Keys

Make sure you have these in your `.env.local`:

### Essential (Required):
```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs (REQUIRED for agents to work)
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key  # Optional but recommended
```

### Optional (For Enhanced Features):
```bash
# Social Media APIs
TWITTER_BEARER_TOKEN=your_twitter_bearer_token  # For Tracer Agent
YOUTUBE_API_KEY=your_youtube_api_key  # For Tracer Agent

# Fact Checking
GOOGLE_FACTCHECK_API_KEY=your_google_factcheck_key  # For Verifier Agent
```

## 🚀 Getting Data to Show

If metrics are showing 0, you need to:

### Step 1: Run the Monitor Agent
This will fetch RSS feeds and populate the database:

```bash
# Via API call
curl -X POST http://localhost:3000/api/agents/monitor

# Or use the "Launch Agents" button in the dashboard
```

### Step 2: Run the Detector Agent
This will analyze content for misinformation:

```bash
# First, get pending content IDs from database
# Then for each content ID:
curl -X POST http://localhost:3000/api/agents/detect \
  -H "Content-Type: application/json" \
  -d '{"contentId": "your-content-id"}'
```

### Step 3: Run Other Agents (Optional)
- **Verifier Agent**: `/api/agents/verify` - Fact-checks claims
- **Tracer Agent**: `/api/agents/trace` - Tracks content spread
- **Alerter Agent**: `/api/agents/alert` - Creates alerts

## 📊 What Each Metric Shows

1. **Scanned Today**: Items with `scan_status = 'completed'` scanned today (or all completed if none today)
2. **Misinformation Detected**: Items with `is_misinformation = true` (today's or all-time)
3. **Active Alerts**: Alerts with `status = 'active'`
4. **Verification Rate**: Percentage of scanned items that are NOT misinformation

## 🔄 Auto-Refresh

- **Metrics**: Refresh every 30 seconds
- **Election Ticker**: Refresh every 10 minutes
- **Real-time**: All components subscribe to Supabase changes for instant updates

## 🐛 Troubleshooting

### If metrics show 0:

1. **Check Supabase Connection**:
   - Verify `.env.local` has correct Supabase credentials
   - Check browser console for connection errors

2. **Check Database**:
   - Go to Supabase dashboard
   - Verify tables exist: `content_items`, `alerts`, `agent_logs`
   - Check if RSS sources are seeded in `rss_sources` table

3. **Run Agents**:
   - Use "Launch Agents" button or API calls
   - Check `agent_logs` table for activity

4. **Check API Keys**:
   - Verify OpenAI API key is valid
   - Check Groq API key if using it
   - Ensure keys have proper permissions

### If no data appears:

- The database might be empty initially
- Run the Monitor Agent first to fetch RSS feeds
- Then run Detector Agent to analyze content
- Alerts will appear automatically when misinformation is detected

## 📝 Next Steps

1. ✅ All components updated to use real API calls
2. ✅ Sample data removed
3. ✅ Auto-refresh enabled
4. ⏳ **You need to**: Run agents to populate database
5. ⏳ **You need to**: Ensure RSS sources are in database (run `supabase-schema.sql`)

## 🎯 Quick Start

1. Make sure `.env.local` has all required API keys
2. Run `supabase-schema.sql` in Supabase SQL Editor
3. Start your dev server: `npm run dev`
4. Click "Launch Agents" button in dashboard
5. Wait for agents to process RSS feeds
6. Metrics will update automatically!

