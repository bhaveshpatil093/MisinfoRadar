import { NextResponse } from 'next/server'
import { AlerterAgent } from '@/lib/agents/alerter-agent'

export async function POST(request: Request) {
  try {
    const { contentId } = await request.json()
    
    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 })
    }
    
    const agent = new AlerterAgent()
    const result = await agent.createAlert(contentId)
    
    return NextResponse.json({ success: true, alert: result })
  } catch (error) {
    console.error('Alerter agent error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

