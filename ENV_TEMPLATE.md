# Environment Variables Template

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_key

# n8n Webhook (for triggering workflows)
N8N_WEBHOOK_URL=your_n8n_webhook_url

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google Fact Check API
GOOGLE_FACTCHECK_API_KEY=your_google_factcheck_key
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

