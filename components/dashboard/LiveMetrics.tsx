'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, CheckCircle, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

export function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    scannedToday: 0,
    misinfoDetected: 0,
    activeAlerts: 0,
    verificationRate: 0
  })
  
  let supabase: ReturnType<typeof createClient> | undefined
  try {
    supabase = createClient()
  } catch (error) {
    // Supabase not configured
    supabase = undefined
  }
  
  useEffect(() => {
    if (!supabase) return
    
    loadMetrics()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('metrics-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_items' },
        () => loadMetrics()
      )
      .subscribe()
    
    return () => {
      supabase?.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  async function loadMetrics() {
    if (!supabase) return
    const today = new Date().toISOString().split('T')[0]
    
    // Get today's scanned items
    const { count: scanned } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)
    
    // Get today's misinformation
    const { count: misinfo } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('is_misinformation', true)
      .gte('created_at', today)
    
    // Get active alerts
    const { count: alerts } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    setMetrics({
      scannedToday: scanned || 0,
      misinfoDetected: misinfo || 0,
      activeAlerts: alerts || 0,
      verificationRate: scanned ? ((scanned - (misinfo || 0)) / scanned * 100) : 0
    })
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`${metric.bgColor} p-2 rounded-lg`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

