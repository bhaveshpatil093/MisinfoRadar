import { NextResponse } from 'next/server'
import { TracerAgent } from '@/lib/agents/tracer-agent'

export async function POST(request: Request) {
  try {
    const { contentId } = await request.json()
    
    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 })
    }
    
    const agent = new TracerAgent()
    const result = await agent.traceContent(contentId)
    
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Tracer agent error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

