import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
  const metrics = [
    { label: 'Avg detection latency', value: '3m 12s', change: '-18% vs last week' },
    { label: 'False positive rate', value: '1.8%', change: 'Stable' },
    { label: 'Counter narrative reach', value: '1.2M users', change: '+240k vs yesterday' },
  ]

  const chains = [
    {
      title: 'Deepfake escalation chain',
      nodes: ['Monitor', 'Detector', 'Verifier', 'Tracer', 'Alerter', 'Counter'],
      time: '14m avg',
    },
    {
      title: 'Turnout rumour chain',
      nodes: ['Monitor', 'Detector', 'Verifier', 'Counter'],
      time: '11m avg',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="glass-panel border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Analytics</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Signal & Response Analytics</h1>
        <p className="mt-2 text-sm text-slate-300">
          Understand how narratives flow across Maharashtra, how fast agents respond, and which
          counter stories perform best.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="glass-panel border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-white">{metric.value}</p>
              <p className="text-sm text-blue-100">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Agent Orchestration Chains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {chains.map((chain) => (
            <div key={chain.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <p className="font-medium text-white">{chain.title}</p>
                <Badge className="border-white/10 bg-white/10 text-white">{chain.time}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                {chain.nodes.map((node, idx) => (
                  <span key={node} className="rounded-full border border-white/10 px-3 py-1">
                    {node}
                    {idx < chain.nodes.length - 1 && <span className="mx-2 text-slate-500">➜</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

