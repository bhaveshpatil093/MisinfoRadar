'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type GeographicSpread = { region?: string | null }
type TraceRecord = { geographic_spread?: GeographicSpread[] | null }

export function DynamicTrackingStats() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [stats, setStats] = useState({
    highRiskDistricts: '0 / 12',
    flaggedNarratives: '0 today',
    counterCampaigns: '0 live',
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadStats()
    const interval = setInterval(loadStats, 60000) // Refresh every minute
    
    return () => clearInterval(interval)
  }, [supabase])
  
  async function loadStats() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // High-risk districts: Count unique regions with critical/high alerts
      const { data: alerts } = await supabase
        .from('alerts')
        .select('content_id')
        .in('severity', ['critical', 'high'])
        .eq('status', 'active')
      
      const contentIds = alerts?.map(a => a.content_id).filter(Boolean) || []
      
      let uniqueRegions = new Set<string>()
      if (contentIds.length > 0) {
        const { data: traces } = await supabase
          .from('source_traces')
          .select('geographic_spread')
          .in('content_id', contentIds)
        
        traces?.forEach((trace: TraceRecord) => {
          if (trace.geographic_spread && Array.isArray(trace.geographic_spread)) {
            trace.geographic_spread.forEach((geo: GeographicSpread) => {
              if (geo.region) uniqueRegions.add(geo.region)
            })
          }
        })
      }
      
      // Flagged narratives today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: flaggedToday } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_misinformation', true)
        .gte('created_at', today.toISOString())
      
      // Counter campaigns (active counter narratives)
      const { count: counterCampaigns } = await supabase
        .from('counter_narratives')
        .select('*', { count: 'exact', head: true })
        .is('published_at', null)
        .not('published_at', 'is', null)
      
      setStats({
        highRiskDistricts: `${uniqueRegions.size} / 12`,
        flaggedNarratives: `${flaggedToday || 0} today`,
        counterCampaigns: `${counterCampaigns || 0} live`,
      })
    } catch (error) {
      console.error('Error loading tracking stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex justify-between text-base text-white animate-pulse">
            <div className="h-4 bg-white/10 rounded w-32"></div>
            <div className="h-4 bg-white/10 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between text-base text-white">
        <span>High-risk districts</span>
        <span className="font-semibold">{stats.highRiskDistricts}</span>
      </div>
      <div className="flex justify-between text-base text-white">
        <span>Flagged narratives</span>
        <span className="font-semibold">{stats.flaggedNarratives}</span>
      </div>
      <div className="flex justify-between text-base text-white">
        <span>Counter campaigns</span>
        <span className="font-semibold">{stats.counterCampaigns}</span>
      </div>
    </div>
  )
}

