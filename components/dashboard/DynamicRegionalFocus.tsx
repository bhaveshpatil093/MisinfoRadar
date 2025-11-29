'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin } from 'lucide-react'

type RegionalFocus = {
  region: string
  signal: string
  confidence: string
  status: 'critical' | 'high' | 'medium' | 'low'
}

export function DynamicRegionalFocus() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [regions, setRegions] = useState<RegionalFocus[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadRegionalFocus()
    const interval = setInterval(loadRegionalFocus, 120000) // Refresh every 2 minutes
    
    return () => clearInterval(interval)
  }, [supabase])
  
  async function loadRegionalFocus() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Get alerts with geographic information
      const { data: alerts } = await supabase
        .from('alerts')
        .select('id, title, message, severity, alert_type, content_id, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (!alerts || alerts.length === 0) {
        setRegions([])
        return
      }
      
      // Get content items for these alerts to extract regions
      const contentIds = alerts.map(a => a.content_id).filter(Boolean)
      let contentMap: Record<string, any> = {}
      
      if (contentIds.length > 0) {
        const { data: contentItems } = await supabase
          .from('content_items')
          .select('id, title, keywords, geographic_spread')
          .in('id', contentIds)
        
        if (contentItems) {
          contentMap = Object.fromEntries(
            contentItems.map(item => [item.id, item])
          )
        }
      }
      
      // Get source traces for geographic spread
      const { data: traces } = await supabase
        .from('source_traces')
        .select('content_id, geographic_spread, spread_pattern')
        .in('content_id', contentIds)
      
      const traceMap: Record<string, any> = {}
      if (traces) {
        traces.forEach(trace => {
          if (trace.content_id) {
            traceMap[trace.content_id] = trace
          }
        })
      }
      
      // Extract regions from alerts and content
      const regionMap: Record<string, { alerts: any[]; maxSeverity: string; maxConfidence: number }> = {}
      
      alerts.forEach(alert => {
        const content = contentMap[alert.content_id]
        const trace = traceMap[alert.content_id]
        
        // Try to extract region from geographic_spread, keywords, or default
        let region = 'Maharashtra'
        
        if (trace?.geographic_spread && Array.isArray(trace.geographic_spread) && trace.geographic_spread.length > 0) {
          region = trace.geographic_spread[0].region || region
        } else if (content?.keywords && Array.isArray(content.keywords)) {
          // Look for city names in keywords
          const cityKeywords = ['Mumbai', 'Pune', 'Nagpur', 'Kolhapur', 'Satara', 'Thane', 'Aurangabad']
          const foundCity = content.keywords.find((k: string) => 
            cityKeywords.some(city => k.toLowerCase().includes(city.toLowerCase()))
          )
          if (foundCity) {
            region = foundCity
          }
        }
        
        if (!regionMap[region]) {
          regionMap[region] = { alerts: [], maxSeverity: 'low', maxConfidence: 0 }
        }
        
        regionMap[region].alerts.push(alert)
        
        // Update max severity
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        if (severityOrder[alert.severity as keyof typeof severityOrder] > 
            severityOrder[regionMap[region].maxSeverity as keyof typeof severityOrder]) {
          regionMap[region].maxSeverity = alert.severity
        }
      })
      
      // Convert to array
      const regionArray: RegionalFocus[] = Object.entries(regionMap)
        .map(([region, data]) => {
          const alert = data.alerts[0]
          const content = contentMap[alert.content_id]
          const trace = traceMap[alert.content_id]
          
          let signal = alert.title || 'Misinformation detected'
          if (trace?.spread_pattern === 'bot_amplified') {
            signal = `Bot amplification: ${signal}`
          } else if (trace?.spread_pattern === 'coordinated') {
            signal = `Coordinated campaign: ${signal}`
          } else if (alert.alert_type === 'deepfake') {
            signal = `Deepfake: ${signal}`
          }
          
          // Calculate confidence from alert or content
          const confidence = alert.content_id && content
            ? (content.misinformation_confidence || 0.5).toFixed(2)
            : '0.50'
          
          return {
            region,
            signal: signal.length > 60 ? signal.substring(0, 60) + '...' : signal,
            confidence,
            status: data.maxSeverity as 'critical' | 'high' | 'medium' | 'low',
          }
        })
        .sort((a, b) => {
          const order = { critical: 4, high: 3, medium: 2, low: 1 }
          return order[b.status] - order[a.status]
        })
        .slice(0, 4)
      
      setRegions(regionArray)
    } catch (error) {
      console.error('Error loading regional focus:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-white/10 rounded w-32"></div>
              <div className="h-6 bg-white/10 rounded w-20"></div>
            </div>
            <div className="h-4 bg-white/10 rounded w-full mb-1"></div>
            <div className="h-3 bg-white/10 rounded w-24"></div>
          </div>
        ))}
      </div>
    )
  }
  
  if (regions.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8 text-sm">
        No regional alerts detected yet. Regional focus will appear here when alerts are created.
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {regions.map((region, idx) => (
        <div key={`${region.region}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
                  : region.status === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-200'
                  : 'bg-blue-500/20 text-blue-200'
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
  )
}

