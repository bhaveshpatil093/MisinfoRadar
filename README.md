# MisinfoRadar

An autonomous, real-time election misinformation detection and verification platform using Agentic AI.

## Features

- 🔍 **Real-time RSS Monitoring** - Continuous scanning of election news from 20+ Indian and international sources
- 🤖 **Multi-Agent AI System** - 6 autonomous agents working in coordination
- 🎭 **Deepfake Detection** - Visual misinformation detection via YouTube analysis
- ✅ **Fact Verification** - Cross-referencing with multiple authoritative sources
- 📊 **Live Dashboard** - Real-time updates with modern UX and smooth animations
- 🚨 **Alert System** - Instant notifications for high-severity misinformation
- 📈 **Analytics** - Trend analysis, source credibility tracking, spread patterns
- 🐦 **Social Media Tracking** - Twitter/X integration for content spread analysis
- 📺 **YouTube Integration** - Video content analysis and deepfake detection
- 🇮🇳 **Maharashtra Sample Dataset** - Built-in demo data for Mumbai, Pune, Nagpur, Kolhapur, Satara, and Thane election narratives when Supabase isn’t connected
- 📰 **RSS Deepfake Scanner** - Pulls from ABP Live, Zee News, Republic World, India TV, CNN, DD News, and Hindustan Times with heuristics to flag suspected deepfakes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Supabase (Database + Realtime)
- **AI/LLM**: OpenAI GPT-4 Turbo, Groq Llama 3
- **APIs**: Twitter/X API v2, YouTube Data API v3
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your API keys and Supabase credentials.

3. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` (to be created)
   - Copy your Supabase URL and anon key to `.env.local`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

### Maharashtra Sample Data

If Supabase/API keys aren’t configured yet, the dashboard automatically falls back to a curated Maharashtra election dataset:

- Live metrics for statewide scanning & detection
- Agent activity logs featuring Pune, Nagpur, Kolhapur, Satara, Mumbai, and Thane incidents
- Alerts for deepfakes, misinformation, and coordinated campaigns
- Recently analyzed content cards with detailed context and confidence scores

This lets you demo the platform end-to-end before wiring up real Supabase + RSS feeds.

## Project Structure

```
misinforadar/
├── app/
│   ├── (dashboard)/          # Dashboard pages
│   ├── api/                   # API routes
│   └── layout.tsx
├── components/
│   ├── dashboard/             # Dashboard components
│   └── ui/                    # UI components
├── lib/
│   ├── agents/                # AI agent implementations
│   ├── supabase/              # Supabase client setup
│   ├── rss/                   # RSS parser
│   └── ai/                    # AI client setup
└── types/                     # TypeScript types
```

## Agents

1. **Monitor Agent** - Scans RSS feeds and discovers new content
2. **Detector Agent** - Analyzes content for misinformation
3. **Verifier Agent** - Fact-checks claims using multiple sources
4. **Tracer Agent** - Tracks content spread and origin
5. **Alerter Agent** - Creates alerts for high-severity misinformation
6. **Counter Agent** - Generates counter-narratives

## API Routes

- `POST /api/agents/monitor` - Trigger RSS scan
- `POST /api/agents/detect` - Analyze content for misinformation
- `POST /api/agents/verify` - Verify claims in content
- `POST /api/agents/trace` - Trace content spread on social media
- `POST /api/agents/alert` - Create alert for content
- `GET /api/analysis/feed` - Fetch scored RSS items from curated election sources
- `POST /api/analysis/manual` - Submit arbitrary text/URL content for realism scoring
- `POST /api/rss/fetch` - Fetch RSS feeds

## Integrated News Sources

### Indian News Channels
- NDTV, Aaj Tak, ABP News, Zee News, Republic TV
- Times of India, India TV, DD News, Hindustan Times
- Multiple election-specific RSS feeds

### International Sources
- CNN Politics, BBC Politics, Reuters Politics

### Fact Checkers
- Alt News, Boom Live, FactCheck.org, PolitiFact

## Database Schema

The project uses Supabase with the following main tables:
- `rss_sources` - RSS feed sources
- `content_items` - Scanned articles/posts
- `agent_logs` - Agent activity logs
- `fact_checks` - Fact-checking results
- `alerts` - Misinformation alerts
- `counter_narratives` - Generated counter-narratives

See the project documentation for the complete schema.

## License

MIT

