import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function createClient() {
  // For server-side usage, we can use the service role key for admin operations
  // or the anon key for regular operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createSupabaseClient(supabaseUrl, supabaseKey)
}

