import { createClient } from '@/lib/supabase/client'
import type { ContentItem } from '@/lib/supabase/types'

export class AlerterAgent {
  private supabase = createClient()
  
  async createAlert(contentId: string) {
    const startTime = Date.now()
    
    try {
      // Get content item
      const { data: content } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .eq('is_misinformation', true)
        .single()
      
      if (!content || !content.severity_level) return
      
      // Only create alerts for medium, high, or critical severity
      if (!['medium', 'high', 'critical'].includes(content.severity_level)) {
        return
      }
      
      // Check if alert already exists
      const { data: existing } = await this.supabase
        .from('alerts')
        .select('id')
        .eq('content_id', contentId)
        .eq('status', 'active')
        .single()
      
      if (existing) return
      
      // Create alert
      const alertType = content.misinformation_type === 'deepfake' 
        ? 'deepfake' 
        : content.severity_level === 'critical' 
        ? 'coordinated_campaign' 
        : 'misinformation'
      
      const { data: alert } = await this.supabase
        .from('alerts')
        .insert({
          content_id: contentId,
          severity: content.severity_level,
          alert_type: alertType,
          title: `Misinformation Detected: ${content.title.substring(0, 100)}`,
          message: `A ${content.severity_level} severity ${content.misinformation_type || 'misinformation'} has been detected. Confidence: ${((content.misinformation_confidence || 0) * 100).toFixed(0)}%`,
          status: 'active',
          sent_to: []
        })
        .select()
        .single()
      
      const processingTime = Date.now() - startTime
      
      // Log activity
      await this.supabase.from('agent_logs').insert({
        content_id: contentId,
        agent_name: 'alerter',
        action: 'alerted',
        details: { alert_id: alert?.id, severity: content.severity_level },
        processing_time_ms: processingTime
      })
      
      console.log(`🚨 Alerter Agent: Created alert for content ${contentId}`)
      
      return alert
      
    } catch (error) {
      console.error('❌ Alerter Agent error:', error)
      throw error
    }
  }
}

