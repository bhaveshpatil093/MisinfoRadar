import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Radio, Wifi } from 'lucide-react'

export default function LivePage() {
  const streams = [
    {
      label: 'Telegram Sensors',
      status: 'Stabilizing',
      incidents: 12,
      latency: '1.2s',
      notes: 'Aurangabad + Kolhapur forward clusters',
    },
    {
      label: 'Twitter/X Firehose',
      status: 'Boosted',
      incidents: 28,
      latency: '0.6s',
      notes: '#VoteMumbai + #PuneResults trending',
    },
    {
      label: 'YouTube Monitor',
      status: 'Normal',
      incidents: 7,
      latency: '2.1s',
      notes: 'Deepfake audio hunts in Satara',
    },
  ]

  const sensors = [
    { name: 'N8N RSS Worker', state: 'Synced 2m ago', severity: 'normal' },
    { name: 'Supabase Realtime', state: 'Stable', severity: 'normal' },
    { name: 'Detector Agent', state: 'High load', severity: 'warning' },
    { name: 'Tracer Agent', state: 'Tracking 62 threads', severity: 'normal' },
    { name: 'Verifier Agent', state: 'Fact-check backlog 4 items', severity: 'warning' },
  ]

  return (
    <div className="space-y-10">
      <div className="glass-panel border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Live Stack</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Live Monitoring</h1>
        <p className="mt-2 text-sm text-slate-300">
          Every 300 seconds the Monitor Agent scrapes 24 feeds, while Detector & Tracer inspect
          Maharashtra-specific narratives in near-real time.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-panel border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-4 w-4 text-blue-400" />
              Sensor Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      : 'bg-green-500/20 text-green-200'
                  } border-none text-xs`}
                >
                  {sensor.severity}
                </Badge>
              </div>
            ))}
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
              <p className="text-xs text-slate-400">Every 5 minutes · last run 2m ago</p>
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
    </div>
  )
}

