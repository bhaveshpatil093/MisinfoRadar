# MisinfoRadar

An autonomous, real-time election misinformation detection and verification platform using Agentic AI.

## Features

- 🔍 **Real-time RSS Monitoring** - Continuous scanning of election news from multiple sources
- 🤖 **Multi-Agent AI System** - 6 autonomous agents working in coordination
- 🎭 **Deepfake Detection** - Visual misinformation detection
- ✅ **Fact Verification** - Cross-referencing with multiple authoritative sources
- 📊 **Live Dashboard** - Real-time updates with modern UX
- 🚨 **Alert System** - Instant notifications for high-severity misinformation
- 📈 **Analytics** - Trend analysis, source credibility tracking, spread patterns

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (Database + Realtime)
- **AI/LLM**: OpenAI GPT-4 Turbo, Groq Llama 3
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
- `POST /api/agents/alert` - Create alert for content
- `POST /api/rss/fetch` - Fetch RSS feeds

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

