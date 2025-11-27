import { createClient } from '@/lib/supabase/client'
import { openai } from '@/lib/ai/openai-client'
import type { ContentItem } from '@/lib/supabase/types'

export class CounterAgent {
  private supabase = createClient()
  
  async generateCounterNarrative(contentId: string, alertId?: string) {
    const startTime = Date.now()
    
    try {
      // Get content item
      const { data: content } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single()
      
      if (!content) return
      
      // Get fact checks
      const { data: factChecks } = await this.supabase
        .from('fact_checks')
        .select('*')
        .eq('content_id', contentId)
      
      // Generate counter narrative
      const narrative = await this.generateNarrative(content, factChecks || [])
      
      // Store counter narrative
      await this.supabase.from('counter_narratives').insert({
        content_id: contentId,
        alert_id: alertId || null,
        format: narrative.format,
        content: narrative.content,
        media_url: narrative.mediaUrl || null,
        target_audience: narrative.targetAudience,
        distribution_channels: narrative.distributionChannels
      })
      
      const processingTime = Date.now() - startTime
      
      // Log activity
      await this.supabase.from('agent_logs').insert({
        content_id: contentId,
        agent_name: 'counter',
        action: 'countered',
        details: { format: narrative.format },
        processing_time_ms: processingTime
      })
      
      console.log(`✅ Counter Agent: Generated counter narrative for content ${contentId}`)
      
    } catch (error) {
      console.error('❌ Counter Agent error:', error)
      throw error
    }
  }
  
  private async generateNarrative(content: ContentItem, factChecks: any[]) {
    if (!openai) {
      return {
        format: 'text',
        content: 'This content has been fact-checked and found to contain misinformation. Please verify information from credible sources.',
        targetAudience: 'general',
        distributionChannels: ['website'],
        mediaUrl: null
      }
    }
    
    const prompt = `Generate a counter-narrative to debunk this misinformation. Create clear, factual, and engaging content that corrects the false claims.

Original Title: ${content.title}
Original Content: ${content.content_text?.substring(0, 1000) || content.description || 'N/A'}

Fact Checks:
${factChecks.map(fc => `- ${fc.claim}: ${fc.verdict} (${fc.reasoning})`).join('\n')}

Provide a JSON response:
{
  "format": "text" | "image" | "video" | "infographic",
  "content": "The counter-narrative text content",
  "targetAudience": "general" | "young_voters" | "elderly" | "specific_region",
  "distributionChannels": ["twitter", "facebook", "whatsapp", "website"]
}

Make it factual, concise, and shareable.`
    
    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized')
      }
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
      
      const result = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        format: result.format || 'text',
        content: result.content || '',
        targetAudience: result.targetAudience || 'general',
        distributionChannels: result.distributionChannels || ['website'],
        mediaUrl: null
      }
      
    } catch (error) {
      console.error('Error generating counter narrative:', error)
      return {
        format: 'text',
        content: 'This content has been fact-checked and found to contain misinformation.',
        targetAudience: 'general',
        distributionChannels: ['website'],
        mediaUrl: null
      }
    }
  }
}

