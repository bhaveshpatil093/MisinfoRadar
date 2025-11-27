# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Supabase account
- OpenAI API key
- Groq API key (optional, but recommended for faster responses)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the SQL Editor
4. Run the SQL script to create all tables and seed data
5. Go to Settings > API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory
2. Copy the template from `ENV_TEMPLATE.md` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the System

1. **Test RSS Fetching:**
   ```bash
   curl -X POST http://localhost:3000/api/rss/fetch
   ```

2. **Test Monitor Agent:**
   ```bash
   curl -X POST http://localhost:3000/api/agents/monitor
   ```

3. **Check the Dashboard:**
   - Navigate to http://localhost:3000
   - You should see the dashboard with metrics and agent activity

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and keys are correct
- Check that Row Level Security policies are set correctly
- Ensure the tables were created successfully

### API Key Issues

- Verify your OpenAI API key has credits
- Check that Groq API key is valid
- Ensure environment variables are loaded (restart dev server after changes)

### RSS Feed Issues

- Some RSS feeds may require CORS headers
- Check browser console for CORS errors
- Consider using a proxy or server-side fetching only

## Next Steps

1. Set up n8n workflows for automated agent triggering
2. Configure additional RSS sources in Supabase
3. Customize agent prompts for your use case
4. Set up alert notifications (email, Slack, etc.)

## Production Deployment

1. Deploy to Vercel:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. Add environment variables in Vercel dashboard

3. Update Supabase RLS policies for production

4. Set up monitoring and logging

