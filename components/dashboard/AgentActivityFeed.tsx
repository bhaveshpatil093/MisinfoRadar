'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, CheckCircle, AlertCircle, Search, Shield, Megaphone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import type { AgentLog } from '@/lib/supabase/types'
const agentIcons = {
  monitor: Search,
  detector: AlertCircle,
  verifier: CheckCircle,
  tracer: Shield,
  alerter: Megaphone,
  counter: Bot
}

const agentColors = {
  monitor: 'bg-blue-100 text-blue-700',
  detector: 'bg-purple-100 text-purple-700',
  verifier: 'bg-green-100 text-green-700',
  tracer: 'bg-yellow-100 text-yellow-700',
  alerter: 'bg-red-100 text-red-700',
  counter: 'bg-indigo-100 text-indigo-700'
}

export function AgentActivityFeed() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      return undefined
    }
  }, [])
  
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadLogs()
    
    // Real-time subscription
    const channel = supabase
      .channel('agent-logs')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_logs' },
        (payload) => {
          setLogs(prev => [payload.new as AgentLog, ...prev].slice(0, 50))
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'agent_logs' },
        () => loadLogs()
      )
      .subscribe()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadLogs, 30000)
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])
  
  async function loadLogs() {
    if (!supabase) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) {
        console.error('Error loading agent logs:', error)
      } else if (data) {
        setLogs(data)
      }
    } catch (error) {
      console.error('Error loading agent logs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Live Agent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading agent activity...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No agent activity yet. Start the agents to see activity here.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {logs.map((log) => {
                const Icon = agentIcons[log.agent_name as keyof typeof agentIcons] || Bot
                const colorClass = agentColors[log.agent_name as keyof typeof agentColors] || 'bg-gray-100 text-gray-700'
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start gap-4 p-4 mb-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className={`${colorClass} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {log.agent_name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {log.action}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      {log.confidence_score && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[200px]">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${log.confidence_score * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {(log.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                      
                      {log.details && (
                        <pre className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

