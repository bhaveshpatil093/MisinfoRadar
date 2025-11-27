import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Supabase credentials missing on server' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { name, url, category, credibility = 0.75 } = body

    if (!name || !url || !category) {
      return NextResponse.json({ error: 'name, url, category required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    const { error } = await supabase.from('rss_sources').insert({
      name,
      url,
      category,
      credibility_score: credibility,
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add source' }, { status: 500 })
  }
}

