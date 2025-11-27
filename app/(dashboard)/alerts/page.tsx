import { AlertCard } from '@/components/dashboard/AlertCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Siren } from 'lucide-react'

export default function AlertsPage() {
  const playbooks = [
    {
      name: 'Deepfake escalation',
      steps: ['Detector → Verifier', 'Manual review', 'Counter-narrative'],
      sla: '15 min',
      level: 'critical',
    },
    {
      name: 'Turnout rumour',
      steps: ['Monitor → Detector', 'Regional blast', 'WhatsApp correction'],
      sla: '20 min',
      level: 'high',
    },
    {
      name: 'Coordinated hashtag',
      steps: ['Tracer → n8n workflow', 'Botnet flag', 'Social response'],
      sla: '30 min',
      level: 'medium',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="glass-panel border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Alerts Command</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Alerts & Escalations</h1>
            <p className="mt-2 text-sm text-slate-300">
              Monitor active alerts, severities, and automated playbooks responding in Maharashtra.
            </p>
          </div>
          <Badge className="border-white/20 bg-white/10 px-4 py-2 text-white">
            <Bell className="mr-2 h-4 w-4" />
            6 Active Alerts
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {playbooks.map((pb) => (
          <Card key={pb.name} className="glass-panel border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                {pb.name}
                <Badge
                  className={`border-none ${
                    pb.level === 'critical'
                      ? 'bg-red-500/20 text-red-100'
                      : pb.level === 'high'
                      ? 'bg-orange-500/20 text-orange-100'
                      : 'bg-yellow-500/20 text-yellow-100'
                  }`}
                >
                  {pb.level}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-200">
              <div className="flex gap-2 text-xs text-slate-400">
                <Siren className="h-4 w-4 text-pink-300" />
                SLA {pb.sla}
              </div>
              <ol className="list-decimal pl-4">
                {pb.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="glass-panel border-white/10 p-6">
        <AlertCard />
      </div>
    </div>
  )
}

