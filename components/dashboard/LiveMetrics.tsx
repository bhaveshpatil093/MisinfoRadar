'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, CheckCircle, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

export function LiveMetrics() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      return undefined
    }
  }, [])
  
  const [metrics, setMetrics] = useState({
    scannedToday: 0,
    misinfoDetected: 0,
    activeAlerts: 0,
    verificationRate: 0,
  })
  
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadMetrics()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('metrics-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_items' },
        () => loadMetrics()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => loadMetrics()
      )
      .subscribe()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])
  
  async function loadMetrics() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Get start of today in UTC
      const now = new Date()
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      const todayISO = today.toISOString()
      
      // Get all content items (for better visibility when database is new)
      const { count: totalItems, error: totalError } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
      
      // Get today's scanned items (items with scan_status = completed and scanned today)
      const { count: scannedToday, error: scannedError } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('scan_status', 'completed')
        .gte('scanned_at', todayISO)
      
      // Fallback: if no items scanned today, show all completed items
      const scannedCount = scannedToday || 0
      const scannedToUse = scannedCount > 0 ? scannedCount : (totalItems || 0)
      
      if (scannedError) {
        console.error('Error fetching scanned items:', scannedError)
      }
      
      // Get all-time misinformation count
      const { count: misinfoAll, error: misinfoAllError } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_misinformation', true)
      
      if (misinfoAllError) {
        console.error('Error fetching misinformation count:', misinfoAllError)
      }
      
      // Get today's misinformation
      const { count: misinfoToday, error: misinfoTodayError } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_misinformation', true)
        .gte('created_at', todayISO)
      
      if (misinfoTodayError) {
        console.error('Error fetching today misinformation:', misinfoTodayError)
      }
      
      // Get active alerts
      const { count: alerts, error: alertsError } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
      
      if (alertsError) {
        console.error('Error fetching alerts:', alertsError)
      }
      
      // Calculate verification rate: (total scanned - misinformation) / total scanned
      const totalScanned = scannedToUse
      const totalMisinfo = misinfoAll || 0
      const verifiedCount = totalScanned > 0 ? totalScanned - totalMisinfo : 0
      const verificationRate = totalScanned > 0 ? (verifiedCount / totalScanned) * 100 : 0
      
      setMetrics({
        scannedToday: scannedToUse,
        misinfoDetected: misinfoToday || misinfoAll || 0, // Show today's if available, else all-time
        activeAlerts: alerts || 0,
        verificationRate: verificationRate,
      })
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const metricCards = [
    {
      title: 'Scanned Today',
      value: metrics.scannedToday,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Misinformation Detected',
      value: metrics.misinfoDetected,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Active Alerts',
      value: metrics.activeAlerts,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Verification Rate',
      value: `${metrics.verificationRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`${metric.bgColor} p-2 rounded-lg animate-pulse`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold tracking-tight ${metric.color}`}>
                {loading ? '...' : metric.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

