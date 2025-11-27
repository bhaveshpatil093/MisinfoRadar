import { NextResponse } from 'next/server'
import { DetectorAgent } from '@/lib/agents/detector-agent'

export async function POST(request: Request) {
  try {
    const { contentId } = await request.json()
    
    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 })
    }
    
    const agent = new DetectorAgent()
    const result = await agent.analyzeContent(contentId)
    
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Detector agent error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

