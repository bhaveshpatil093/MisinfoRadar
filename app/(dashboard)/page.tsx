import Link from 'next/link'
import { LiveMetrics } from '@/components/dashboard/LiveMetrics'
import { AgentActivityFeed } from '@/components/dashboard/AgentActivityFeed'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { ContentCard } from '@/components/dashboard/ContentCard'
import { LaunchAgentsButton } from '@/components/dashboard/LaunchAgentsButton'
import { DynamicSpotlight } from '@/components/dashboard/DynamicSpotlight'
import { DynamicRegionalFocus } from '@/components/dashboard/DynamicRegionalFocus'
import { DynamicHashtags } from '@/components/dashboard/DynamicHashtags'
import { SyncTimer } from '@/components/dashboard/SyncTimer'
import { DynamicTrackingStats } from '@/components/dashboard/DynamicTrackingStats'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ElectionTicker } from '@/components/dashboard/ElectionTicker'
import { Activity, Satellite } from 'lucide-react'

export default function DashboardPage() {

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
            <Badge className="border-white/10 bg-white/10 text-xs text-slate-200">
              Lok Sabha 2025 · Phase III
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
              Real-time election misinformation radar for Mumbai & beyond.
            </h1>
            <p className="text-base text-slate-200">
              Six autonomous agents monitor 24/7 feeds, verify claims, trace narratives,
              and launch counter-messaging across the state within minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <LaunchAgentsButton />
              <Button variant="ghost" asChild>
                <Link href="/live" className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Watch Live Flow
                </Link>
              </Button>
            </div>
          </div>
          <div className="glass-panel w-full max-w-sm border-white/20 bg-slate-900/60 p-6 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Now Tracking</p>
            <DynamicTrackingStats />
            <SyncTimer />
          </div>
        </div>
      </div>
      
      <ElectionTicker />

      {/* Live Metrics + Spotlight */}
      <div className="space-y-6">
        <LiveMetrics />
        <DynamicSpotlight />
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
          <div className="mt-6">
            <DynamicRegionalFocus />
          </div>
        </div>
        <div className="glass-panel border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Trending Signals</p>
          <h2 className="mt-3 text-xl font-semibold text-white">Hashtags & Payloads</h2>
          <div className="mt-6">
            <DynamicHashtags />
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

