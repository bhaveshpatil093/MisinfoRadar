'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Radio, Wifi } from 'lucide-react'
import { DynamicLiveStreams } from '@/components/dashboard/DynamicLiveStreams'
import { DynamicSensors } from '@/components/dashboard/DynamicSensors'
import { DynamicTimeline } from '@/components/dashboard/DynamicTimeline'
import { useMemo, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

export default function LivePage() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [lastRun, setLastRun] = useState<string>('')
  
  useEffect(() => {
    if (!supabase) return
    
    const loadLastRun = async () => {
      const { data } = await supabase
        .from('agent_logs')
        .select('created_at')
        .eq('agent_name', 'monitor')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) {
        setLastRun(` · last run ${formatDistanceToNow(new Date(data.created_at), { addSuffix: true })}`)
      }
    }
    
    loadLastRun()
    const interval = setInterval(loadLastRun, 60000)
    return () => clearInterval(interval)
  }, [supabase])

  return (
    <div className="space-y-10">
      <div className="glass-panel border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Live Stack</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Live Monitoring</h1>
        <p className="mt-2 text-sm text-slate-300">
          Every 300 seconds the Monitor Agent scrapes 24 feeds, while Detector & Tracer inspect
          Maharashtra-specific narratives in near-real time.
        </p>
        <div className="mt-6">
          <DynamicLiveStreams />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-panel border-white/10 bg-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-4 w-4 text-blue-400" />
              Sensor Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicSensors />
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Radio className="h-4 w-4 text-purple-300" />
              Live Streams & Hooks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-slate-200">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Webhooks</p>
              <p className="mt-2 text-white">n8n → /api/agents/monitor</p>
              <p className="text-xs text-slate-400">
                Every {parseInt(process.env.NEXT_PUBLIC_MONITOR_SCAN_INTERVAL_MS || '300000') / 60000} minutes{lastRun}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Supabase Live Query</p>
              <p className="mt-2 text-white">content_items::scan_status = 'pending'</p>
              <p className="text-xs text-slate-400">50 latest records monitored</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 p-4 text-xs text-white">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <span>Streamer mode</span>
              </div>
              <p className="mt-2 text-slate-100">
                Detector Agent auto-fetch will pause if API quota crosses 90%.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DynamicTimeline />
    </div>
  )
}

