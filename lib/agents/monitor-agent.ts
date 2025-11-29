import { createClient } from '@/lib/supabase/client'
import { fetchAndStoreRSSFeeds } from '@/lib/rss/parser'

export class MonitorAgent {
  private supabase = createClient()
  private isRunning = false
  
  async start() {
    this.isRunning = true
    console.log('🔍 Monitor Agent: Started')
    
    const scanInterval = parseInt(process.env.MONITOR_SCAN_INTERVAL_MS || '300000') // Default 5 minutes
    
    while (this.isRunning) {
      await this.scan()
      await this.sleep(scanInterval)
    }
  }
  
  async scan() {
    const startTime = Date.now()
    const batchSize = parseInt(process.env.MONITOR_BATCH_SIZE || '50')
    
    try {
      // Log agent activity
      await this.logActivity('scan_started', { timestamp: new Date().toISOString() })
      
      // Fetch RSS feeds
      await fetchAndStoreRSSFeeds()
      
      // Get pending items
      const { data: pendingItems } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('scan_status', 'pending')
        .order('published_at', { ascending: false })
        .limit(batchSize)
      
      const processingTime = Date.now() - startTime
      
      await this.logActivity('scan_completed', {
        items_found: pendingItems?.length || 0,
        processing_time_ms: processingTime
      })
      
      console.log(`✅ Monitor Agent: Found ${pendingItems?.length || 0} new items`)
      
      return { success: true, itemsFound: pendingItems?.length || 0 }
      
    } catch (error) {
      console.error('❌ Monitor Agent error:', error)
      await this.logActivity('scan_failed', { error: String(error) })
      throw error
    }
  }
  
  private async logActivity(action: string, details: any) {
    await this.supabase.from('agent_logs').insert({
      agent_name: 'monitor',
      action,
      details,
      processing_time_ms: details.processing_time_ms || null
    })
  }
  
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  stop() {
    this.isRunning = false
    console.log('🛑 Monitor Agent: Stopped')
  }
}

