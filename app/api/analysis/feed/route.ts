import { NextResponse } from 'next/server'
import { fetchAnalyzedFeeds } from '@/lib/rss/feed-service'

export async function GET() {
  try {
    const items = await fetchAnalyzedFeeds()
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Feed analysis error', error)
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 })
  }
}

