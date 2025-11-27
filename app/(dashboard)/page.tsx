import { LiveMetrics } from '@/components/dashboard/LiveMetrics'
import { AgentActivityFeed } from '@/components/dashboard/AgentActivityFeed'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { ContentCard } from '@/components/dashboard/ContentCard'
import { Button } from '@/components/ui/button'
import { Activity, MapPin, Satellite, ShieldCheck } from 'lucide-react'

export default function DashboardPage() {
  const spotlight = [
    {
      title: 'Maharashtra Pulse',
      stat: '128 stories',
      delta: '+18% vs yesterday',
      description: 'Mumbai, Pune, Nagpur heatmap refreshed 2m ago.',
    },
    {
      title: 'Critical Alerts',
      stat: '6 live incidents',
      delta: '3 deepfake, 2 mobilization, 1 turnout hoax',
      description: 'Kolhapur, Satara, and Thane on high watch.',
    },
    {
      title: 'Agent Health',
      stat: '6 agents active',
      delta: '99.2% uptime',
      description: 'Detector + Tracer running boosted mode.',
    },
  ]

  const regionalFocus = [
    {
      region: 'Mumbai Metropolitan',
      signal: 'Bot amplification of resignation rumour',
      confidence: '0.78',
      status: 'critical',
    },
    {
      region: 'Pune Rural',
      signal: 'False WhatsApp turnout advisory',
      confidence: '0.71',
      status: 'high',
    },
    {
      region: 'Nagpur',
      signal: 'Coordinated hashtag #StopTheCount',
      confidence: '0.64',
      status: 'medium',
    },
    {
      region: 'Kolhapur',
      signal: 'Deepfake audio clip emerging',
      confidence: '0.81',
      status: 'critical',
    },
  ]

  const trendingHashtags = [
    { tag: '#VoteMumbai', volume: '41k mentions', sentiment: '61% neutral' },
    { tag: '#PuneResults', volume: '22k mentions', sentiment: '48% misinformation flagged' },
    { tag: '#NagpurSpeaks', volume: '11k mentions', sentiment: '32% coordinated' },
  ]

  return (
    <div className="space-y-10 pb-16">
      {/* Hero */}
      <div className="glass-panel gradient-border relative overflow-hidden px-8 py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-500/10 to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
              Maharashtra Command Center
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
              Real-time election misinformation radar for Mumbai & beyond.
            </h1>
            <p className="text-base text-slate-200">
              Six autonomous agents monitor 24/7 feeds, verify claims, trace narratives,
              and launch counter-messaging across the state within minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-blue-500/30 hover:opacity-90">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Engage Defense Stack
              </Button>
              <Button variant="ghost">
                <Activity className="mr-2 h-4 w-4" />
                Watch Live Flow
              </Button>
            </div>
          </div>
          <div className="glass-panel w-full max-w-sm border-white/20 bg-slate-900/60 p-6 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Now Tracking</p>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between text-base text-white">
                <span>High-risk districts</span>
                <span className="font-semibold">7 / 12</span>
              </div>
              <div className="flex justify-between text-base text-white">
                <span>Flagged narratives</span>
                <span className="font-semibold">42 today</span>
              </div>
              <div className="flex justify-between text-base text-white">
                <span>Counter campaigns</span>
                <span className="font-semibold">15 live</span>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              Next agent sync in <span className="font-semibold text-white">02m 15s</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Metrics + Spotlight */}
      <div className="space-y-6">
        <LiveMetrics />
        <div className="grid gap-4 md:grid-cols-3">
          {spotlight.map((card) => (
            <div key={card.title} className="glass-panel border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-200">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{card.stat}</p>
              <p className="text-sm text-blue-100">{card.delta}</p>
              <p className="mt-3 text-sm text-slate-300">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Regional focus */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel border-white/10 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Field Intel</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Regional Watchlist</h2>
            </div>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300">
              Maharashtra
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {regionalFocus.map((region) => (
              <div key={region.region} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">{region.region}</span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs ${
                      region.status === 'critical'
                        ? 'bg-red-500/20 text-red-200'
                        : region.status === 'high'
                        ? 'bg-orange-500/20 text-orange-200'
                        : 'bg-yellow-500/20 text-yellow-200'
                    }`}
                  >
                    {region.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200">{region.signal}</p>
                <p className="text-xs text-slate-400">Confidence {region.confidence}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Trending Signals</p>
          <h2 className="mt-3 text-xl font-semibold text-white">Hashtags & Payloads</h2>
          <div className="mt-6 space-y-4">
            {trendingHashtags.map((trend) => (
              <div key={trend.tag} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold text-white">{trend.tag}</p>
                <p className="text-sm text-slate-300">{trend.volume}</p>
                <p className="text-xs text-slate-400">{trend.sentiment}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-4 text-sm text-white">
            <div className="flex items-center gap-2">
              <Satellite className="h-4 w-4" />
              <span>Ground truth sync enabled</span>
            </div>
            <p className="mt-2 text-xs text-slate-100">
              n8n workflow will broadcast if anomaly &gt; 0.7 confidence.
            </p>
          </div>
        </div>
      </div>
      
      {/* Live systems */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel border-white/10 p-0 lg:col-span-2">
          <AgentActivityFeed />
        </div>
        <div className="glass-panel border-white/10 p-0">
          <AlertCard />
        </div>
      </div>
      
      {/* Recent Content */}
      <div className="glass-panel border-white/10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Verification Trail</p>
            <h2 className="text-2xl font-semibold text-white">Recently Analyzed Content</h2>
          </div>
          <Button variant="ghost" className="text-xs text-slate-300">
            View reports
          </Button>
        </div>
        <ContentCard />
      </div>
    </div>
  )
}

