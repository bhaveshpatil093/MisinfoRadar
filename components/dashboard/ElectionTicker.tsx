'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'

type TickerItem = {
  headline: string
  source: string
  state: string
  time: string
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function ElectionTicker() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [items, setItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    const loadMisinformation = async () => {
      try {
        setLoading(true)
        // First try to fetch alerts
        const { data: alerts, error: alertsError } = await supabase
          .from('alerts')
          .select('id, title, message, severity, alert_type, created_at, content_id')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (alerts && alerts.length > 0 && !alertsError) {
          // Get content items for these alerts
          const contentIds = alerts.map(a => a.content_id).filter(Boolean)
          let contentItemsMap: Record<string, any> = {}
          
          if (contentIds.length > 0) {
            const { data: contentItems } = await supabase
              .from('content_items')
              .select('id, title, is_election_related')
              .in('id', contentIds)
            
            if (contentItems) {
              contentItemsMap = Object.fromEntries(
                contentItems.map(item => [item.id, item])
              )
            }
          }
          
          const tickerItems: TickerItem[] = alerts
            .filter(alert => {
              const content = contentItemsMap[alert.content_id]
              return content?.is_election_related !== false
            })
            .map((alert) => {
              const content = contentItemsMap[alert.content_id]
              return {
                headline: alert.title || content?.title || 'Political Misinformation Detected',
                source: alert.alert_type === 'deepfake' ? 'Deepfake Alert' :
                        alert.severity === 'critical' ? 'Critical Alert' : 'Misinformation Alert',
                state: 'Maharashtra',
                time: formatTimeAgo(new Date(alert.created_at))
              }
            })
          
          if (tickerItems.length > 0) {
            setItems(tickerItems)
            return
          }
        }
        
        // Fallback to content items with misinformation (include election-related check)
        const { data: contentItems } = await supabase
          .from('content_items')
          .select('title, description, severity_level, misinformation_type, created_at, is_election_related')
          .eq('is_misinformation', true)
          .order('created_at', { ascending: false })
          .limit(20)
        
        // Filter for election-related or show all if none are election-related
        const electionItems = contentItems?.filter(item => 
          item.is_election_related !== false
        ) || contentItems || []
        
        if (electionItems && electionItems.length > 0) {
          const tickerItems: TickerItem[] = electionItems.slice(0, 10).map((item) => ({
            headline: item.title || 'Misinformation Detected',
            source: item.misinformation_type === 'deepfake' ? 'Deepfake Alert' : 
                    item.severity_level === 'critical' ? 'Critical Alert' : 
                    item.severity_level === 'high' ? 'High Alert' : 'Misinformation Alert',
            state: 'Maharashtra',
            time: formatTimeAgo(new Date(item.created_at))
          }))
          setItems(tickerItems)
        }
      } catch (error) {
        console.error('Error loading misinformation:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Load immediately
    loadMisinformation()
    
    // Refresh every 10 minutes (600000ms)
    const interval = setInterval(loadMisinformation, 600000)
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('ticker-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' },
        () => loadMisinformation()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'content_items' },
        () => loadMisinformation()
      )
      .subscribe()
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [supabase])
  
  return (
    <div className="glass-panel border-white/10 bg-white/5 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">
          Fake Political Misinformation
        </h3>
        <span className="text-xs text-slate-400">
          Updates every 10 minutes
        </span>
      </div>
      {loading ? (
        <div className="text-center text-slate-400 py-4 text-sm">
          Loading misinformation alerts...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-slate-400 py-4 text-sm">
          No political misinformation detected yet. The system will display alerts here when misinformation is found.
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 text-sm text-white">
          {items.slice(0, 8).map((item, index) => (
          <div key={`${item.headline}-${index}`} className="flex flex-wrap items-center gap-2">
            <Badge className="border-red-500/30 bg-red-500/20 text-xs text-red-200">
              {item.state}
            </Badge>
            <span className="font-semibold">{item.headline}</span>
            <span className="text-xs text-slate-300">{item.source}</span>
            <span className="text-xs text-blue-200">{item.time}</span>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

