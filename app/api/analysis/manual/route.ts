import { NextResponse } from 'next/server'
import { analyzeManualInput } from '@/lib/rss/feed-service'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const result = await analyzeManualInput(content)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Manual analysis error', error)
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 })
  }
}

