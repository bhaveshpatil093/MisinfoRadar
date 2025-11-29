'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

type Stream = {
  label: string
  status: string
  incidents: number
  latency: string
  notes: string
}

export function DynamicLiveStreams() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadStreams()
    const interval = setInterval(loadStreams, 60000) // Refresh every minute
    
    return () => clearInterval(interval)
  }, [supabase])
  
  async function loadStreams() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Get recent content items by source/platform
      const { data: recentContent } = await supabase
        .from('content_items')
        .select('url, created_at, source_id')
        .order('created_at', { ascending: false })
        .limit(100)
      
      // Get source traces for platform distribution
      const { data: traces } = await supabase
        .from('source_traces')
        .select('platform_distribution, created_at')
        .order('created_at', { ascending: false })
        .limit(50)
      
      // Calculate incidents in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const recentCount = recentContent?.filter(item => 
        new Date(item.created_at) > new Date(oneHourAgo)
      ).length || 0
      
      // Extract platform info from traces
      const platformCounts: Record<string, number> = {}
      traces?.forEach(trace => {
        if (trace.platform_distribution && Array.isArray(trace.platform_distribution)) {
          trace.platform_distribution.forEach((platform: any) => {
            platformCounts[platform.name || platform] = 
              (platformCounts[platform.name || platform] || 0) + 1
          })
        }
      })
      
      // Get last activity times
      const { data: lastMonitor } = await supabase
        .from('agent_logs')
        .select('created_at')
        .eq('agent_name', 'monitor')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      const { data: lastDetector } = await supabase
        .from('agent_logs')
        .select('created_at')
        .eq('agent_name', 'detector')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      // Get deepfake detections
      const { data: deepfakes } = await supabase
        .from('content_items')
        .select('id')
        .eq('misinformation_type', 'deepfake')
        .gte('created_at', oneHourAgo)
      
      const streamsData: Stream[] = [
        {
          label: 'RSS Feed Monitor',
          status: lastMonitor ? 'Active' : 'Starting',
          incidents: recentCount,
          latency: lastMonitor 
            ? formatDistanceToNow(new Date(lastMonitor.created_at), { addSuffix: false })
            : 'N/A',
          notes: lastMonitor 
            ? `Last scan ${formatDistanceToNow(new Date(lastMonitor.created_at), { addSuffix: true })}`
            : 'Waiting for first scan',
        },
        {
          label: 'Content Detector',
          status: lastDetector ? 'Active' : 'Idle',
          incidents: recentContent?.filter(item => 
            new Date(item.created_at) > new Date(oneHourAgo)
          ).length || 0,
          latency: lastDetector
            ? formatDistanceToNow(new Date(lastDetector.created_at), { addSuffix: false })
            : 'N/A',
          notes: deepfakes && deepfakes.length > 0
            ? `${deepfakes.length} deepfake(s) detected in last hour`
            : 'No deepfakes detected recently',
        },
        {
          label: 'Social Media Monitor',
          status: platformCounts['twitter'] || platformCounts['youtube'] ? 'Active' : 'Idle',
          incidents: Object.values(platformCounts).reduce((a, b) => a + b, 0),
          latency: traces && traces.length > 0
            ? formatDistanceToNow(new Date(traces[0].created_at), { addSuffix: false })
            : 'N/A',
          notes: Object.keys(platformCounts).length > 0
            ? `Tracking ${Object.keys(platformCounts).join(', ')}`
            : 'No social media activity tracked yet',
        },
      ]
      
      setStreams(streamsData)
    } catch (error) {
      console.error('Error loading streams:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="glass-panel border-white/5 bg-white/5 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-white/10 rounded w-32 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-24"></div>
                <div className="h-4 bg-white/10 rounded w-20"></div>
                <div className="h-3 bg-white/10 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {streams.map((stream) => (
        <Card key={stream.label} className="glass-panel border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              {stream.label}
              <Badge variant="outline" className="border-white/20 text-xs text-white">
                {stream.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>Incidents: {stream.incidents}</p>
            <p>Latency: {stream.latency}</p>
            <p className="text-xs text-slate-400">{stream.notes}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

