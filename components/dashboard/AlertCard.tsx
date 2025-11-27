'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import type { Alert } from '@/lib/supabase/types'
import { sampleAlerts } from '@/lib/sample-data'

const severityColors = {
  low: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  medium: 'bg-orange-100 text-orange-700 border-orange-300',
  high: 'bg-red-100 text-red-700 border-red-300',
  critical: 'bg-red-200 text-red-800 border-red-400'
}

export function AlertCard() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  const isSampleMode = !supabase
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    isSampleMode ? (sampleAlerts as Alert[]) : []
  )
  
  useEffect(() => {
    if (!supabase) return
    
    loadAlerts()
    
    // Real-time subscription
    const channel = supabase
      .channel('alerts-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => loadAlerts()
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])
  
  async function loadAlerts() {
    if (!supabase) return
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) setAlerts(data)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {alerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No active alerts
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${severityColors[alert.severity]} hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="capitalize">
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-1">{alert.title}</h4>
                  <p className="text-sm opacity-90">{alert.message}</p>
                  <div className="mt-2 text-xs opacity-75">
                    Type: {alert.alert_type}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

