import { NextResponse } from 'next/server'
import { fetchAndStoreRSSFeeds } from '@/lib/rss/parser'

export async function POST(request: Request) {
  try {
    await fetchAndStoreRSSFeeds()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('RSS fetch error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

