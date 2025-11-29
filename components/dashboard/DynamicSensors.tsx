'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

type Sensor = {
  name: string
  state: string
  severity: 'normal' | 'warning' | 'error'
}

export function DynamicSensors() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadSensors()
    const interval = setInterval(loadSensors, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [supabase])
  
  async function loadSensors() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Get last activity for each agent
      const agents = ['monitor', 'detector', 'verifier', 'tracer', 'alerter', 'counter']
      const agentStatuses: Record<string, { lastSeen: Date | null; count: number }> = {}
      
      for (const agent of agents) {
        const { data: logs } = await supabase
          .from('agent_logs')
          .select('created_at')
          .eq('agent_name', agent)
          .order('created_at', { ascending: false })
          .limit(1)
        
        agentStatuses[agent] = {
          lastSeen: logs && logs.length > 0 ? new Date(logs[0].created_at) : null,
          count: logs?.length || 0,
        }
      }
      
      // Get pending items count
      const { count: pendingCount } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('scan_status', 'pending')
      
      // Get fact-check backlog
      const { count: factCheckBacklog } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_misinformation', true)
        .is('scan_status', 'completed')
      
      // Get tracer threads
      const { data: traces } = await supabase
        .from('source_traces')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(100)
      
      const sensorsData: Sensor[] = [
        {
          name: 'RSS Feed Monitor',
          state: agentStatuses.monitor.lastSeen
            ? `Synced ${formatDistanceToNow(agentStatuses.monitor.lastSeen, { addSuffix: true })}`
            : 'Never synced',
          severity: agentStatuses.monitor.lastSeen && 
            Date.now() - agentStatuses.monitor.lastSeen.getTime() < 10 * 60 * 1000
            ? 'normal'
            : 'warning',
        },
        {
          name: 'Supabase Realtime',
          state: 'Stable',
          severity: 'normal',
        },
        {
          name: 'Detector Agent',
          state: pendingCount && pendingCount > 50
            ? 'High load'
            : agentStatuses.detector.lastSeen
            ? `Active ${formatDistanceToNow(agentStatuses.detector.lastSeen, { addSuffix: true })}`
            : 'Idle',
          severity: pendingCount && pendingCount > 50 ? 'warning' : 'normal',
        },
        {
          name: 'Tracer Agent',
          state: traces && traces.length > 0
            ? `Tracking ${traces.length} threads`
            : 'No threads',
          severity: 'normal',
        },
        {
          name: 'Verifier Agent',
          state: factCheckBacklog && factCheckBacklog > 0
            ? `Fact-check backlog ${factCheckBacklog} items`
            : agentStatuses.verifier.lastSeen
            ? `Active ${formatDistanceToNow(agentStatuses.verifier.lastSeen, { addSuffix: true })}`
            : 'Idle',
          severity: factCheckBacklog && factCheckBacklog > 10 ? 'warning' : 'normal',
        },
      ]
      
      setSensors(sensorsData)
    } catch (error) {
      console.error('Error loading sensors:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-32"></div>
            <div className="h-6 bg-white/10 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {sensors.map((sensor) => (
        <div
          key={sensor.name}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
        >
          <div>
            <p className="font-medium text-white">{sensor.name}</p>
            <p className="text-xs text-slate-400">{sensor.state}</p>
          </div>
          <Badge
            className={`${
              sensor.severity === 'warning'
                ? 'bg-orange-500/20 text-orange-200'
                : sensor.severity === 'error'
                ? 'bg-red-500/20 text-red-200'
                : 'bg-green-500/20 text-green-200'
            } border-none text-xs`}
          >
            {sensor.severity}
          </Badge>
        </div>
      ))}
    </div>
  )
}

