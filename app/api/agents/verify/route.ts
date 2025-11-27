import { NextResponse } from 'next/server'
import { VerifierAgent } from '@/lib/agents/verifier-agent'

export async function POST(request: Request) {
  try {
    const { contentId } = await request.json()
    
    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 })
    }
    
    const agent = new VerifierAgent()
    await agent.verifyContent(contentId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verifier agent error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

