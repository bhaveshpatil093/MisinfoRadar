import { NextResponse } from 'next/server'
import { MonitorAgent } from '@/lib/agents/monitor-agent'

export async function POST(request: Request) {
  try {
    const agent = new MonitorAgent()
    const result = await agent.scan()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Monitor agent error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

