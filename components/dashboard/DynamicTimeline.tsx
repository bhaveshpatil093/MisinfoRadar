'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock3 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type TimelineEvent = {
  time: string
  title: string
  details: string
}

export function DynamicTimeline() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadTimeline()
    const interval = setInterval(loadTimeline, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [supabase])
  
  async function loadTimeline() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Get last 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
      
      // Get recent agent logs
      const { data: logs } = await supabase
        .from('agent_logs')
        .select('agent_name, action, details, created_at, content_id')
        .gte('created_at', fifteenMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(10)
      
      // Get recent alerts
      const { data: alerts } = await supabase
        .from('alerts')
        .select('title, alert_type, severity, created_at')
        .gte('created_at', fifteenMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(5)
      
      // Get recent counter narratives
      const { data: counters } = await supabase
        .from('counter_narratives')
        .select('content, reach_count, engagement_count, created_at')
        .gte('created_at', fifteenMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(3)
      
      const timelineEvents: TimelineEvent[] = []
      
      // Add detector events
      logs?.filter(log => log.agent_name === 'detector' && log.action.includes('detected')).forEach(log => {
        const details = log.details as any
        timelineEvents.push({
          time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true }),
          title: `Detector flagged ${details.misinformation_type || 'misinformation'}`,
          details: `Confidence ${(details.confidence || 0.5).toFixed(2)} · escalated to Verifier`,
        })
      })
      
      // Add tracer events
      logs?.filter(log => log.agent_name === 'tracer').forEach(log => {
        const details = log.details as any
        if (details.spread_pattern) {
          timelineEvents.push({
            time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true }),
            title: `Tracer mapped ${details.spread_pattern} pattern`,
            details: details.sharing_accounts 
              ? `${details.sharing_accounts.length} suspect accounts`
              : 'Pattern detected',
          })
        }
      })
      
      // Add counter narrative events
      counters?.forEach(counter => {
        timelineEvents.push({
          time: formatDistanceToNow(new Date(counter.created_at), { addSuffix: true }),
          title: `Counter narrative published`,
          details: `Reach ${counter.reach_count || 0} · Engagement ${counter.engagement_count || 0}`,
        })
      })
      
      // Sort by time and take most recent 3
      timelineEvents.sort((a, b) => {
        const timeA = a.time.includes('ago') ? parseInt(a.time) : 0
        const timeB = b.time.includes('ago') ? parseInt(b.time) : 0
        return timeA - timeB
      })
      
      setEvents(timelineEvents.slice(0, 3))
    } catch (error) {
      console.error('Error loading timeline:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <Card className="glass-panel border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock3 className="h-4 w-4 text-emerald-300" />
            Last 15-Minute Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-full mb-1"></div>
              <div className="h-3 bg-white/10 rounded w-32"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
  
  if (events.length === 0) {
    return (
      <Card className="glass-panel border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock3 className="h-4 w-4 text-emerald-300" />
            Last 15-Minute Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400 py-8 text-sm">
            No recent activity in the last 15 minutes. Activity will appear here as agents process content.
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="glass-panel border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock3 className="h-4 w-4 text-emerald-300" />
          Last 15-Minute Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
        {events.map((event, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{event.time}</p>
            <p className="mt-2 text-white">{event.title}</p>
            <p className="text-xs text-slate-400">{event.details}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

