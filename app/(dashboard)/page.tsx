import { LiveMetrics } from '@/components/dashboard/LiveMetrics'
import { AgentActivityFeed } from '@/components/dashboard/AgentActivityFeed'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { ContentCard } from '@/components/dashboard/ContentCard'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">
          MisinfoRadar
        </h1>
        <p className="text-muted-foreground mt-2">
          Autonomous Election Integrity Monitoring System
        </p>
      </div>
      
      {/* Live Metrics */}
      <LiveMetrics />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Activity Feed */}
        <AgentActivityFeed />
        
        {/* Recent Alerts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Active Alerts</h2>
          <AlertCard />
        </div>
      </div>
      
      {/* Recent Content */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recently Analyzed Content</h2>
        <ContentCard />
      </div>
    </div>
  )
}

