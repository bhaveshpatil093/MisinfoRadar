'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function SyncTimer() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [timeRemaining, setTimeRemaining] = useState<string>('--:--')
  
  useEffect(() => {
    if (!supabase) return
    
    const updateTimer = () => {
      // Get monitor agent scan interval from env
      const scanInterval = parseInt(process.env.NEXT_PUBLIC_MONITOR_SCAN_INTERVAL_MS || '300000') // Default 5 minutes
      
      // Get last monitor agent run
      supabase
        .from('agent_logs')
        .select('created_at')
        .eq('agent_name', 'monitor')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data) {
            const lastRun = new Date(data.created_at).getTime()
            const nextRun = lastRun + scanInterval
            const now = Date.now()
            const remaining = Math.max(0, nextRun - now)
            
            const minutes = Math.floor(remaining / 60000)
            const seconds = Math.floor((remaining % 60000) / 1000)
            
            setTimeRemaining(`${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`)
          } else {
            setTimeRemaining('Starting...')
          }
        })
        .catch(() => {
          setTimeRemaining('--:--')
        })
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000) // Update every second
    
    return () => clearInterval(interval)
  }, [supabase])
  
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
      Next agent sync in <span className="font-semibold text-white">{timeRemaining}</span>
    </div>
  )
}

