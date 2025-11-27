import { createClient } from '@/lib/supabase/client'
import { openai } from '@/lib/ai/openai-client'
import { groq } from '@/lib/ai/groq-client'
import type { ContentItem } from '@/lib/supabase/types'

export class DetectorAgent {
  private supabase = createClient()
  
  async analyzeContent(contentId: string) {
    const startTime = Date.now()
    
    try {
      // Get content item
      const { data: content } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single()
      
      if (!content) return
      
      // Update status
      await this.supabase
        .from('content_items')
        .update({ scan_status: 'scanning' })
        .eq('id', contentId)
      
      // Step 1: Check if election-related
      const isElectionRelated = await this.checkElectionRelevance(content)
      
      if (!isElectionRelated) {
        await this.supabase
          .from('content_items')
          .update({ 
            scan_status: 'completed',
            is_election_related: false,
            scanned_at: new Date().toISOString()
          })
          .eq('id', contentId)
        return
      }
      
      // Step 2: Detect misinformation
      const analysis = await this.detectMisinformation(content)
      
      // Update content with results
      await this.supabase
        .from('content_items')
        .update({
          scan_status: 'completed',
          scanned_at: new Date().toISOString(),
          is_election_related: true,
          is_misinformation: analysis.isMisinformation,
          misinformation_confidence: analysis.confidence,
          misinformation_type: analysis.type,
          severity_level: analysis.severity
        })
        .eq('id', contentId)
      
      const processingTime = Date.now() - startTime
      
      // Log activity
      await this.supabase.from('agent_logs').insert({
        content_id: contentId,
        agent_name: 'detector',
        action: 'analyzed',
        details: analysis,
        confidence_score: analysis.confidence,
        processing_time_ms: processingTime
      })
      
      console.log(`🔍 Detector Agent: Analyzed content ${contentId}`)
      
      return analysis
      
    } catch (error) {
      console.error('❌ Detector Agent error:', error)
      
      await this.supabase
        .from('content_items')
        .update({ scan_status: 'failed' })
        .eq('id', contentId)
      
      throw error
    }
  }
  
  private async checkElectionRelevance(content: ContentItem): Promise<boolean> {
    if (!groq) {
      console.warn('Groq client not initialized, skipping election relevance check')
      return true // Default to true if API key is missing
    }
    
    const prompt = `Analyze if this news article is related to elections, voting, political campaigns, or electoral processes.

Title: ${content.title}
Description: ${content.description || 'N/A'}
Content: ${content.content_text?.substring(0, 500) || 'N/A'}

Respond with only "YES" or "NO".`
    
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 10
      })
      
      const answer = response.choices[0].message.content?.trim().toUpperCase()
      return answer === 'YES'
      
    } catch (error) {
      console.error('Error checking election relevance:', error)
      return false
    }
  }
  
  private async detectMisinformation(content: ContentItem) {
    if (!openai) {
      console.warn('OpenAI client not initialized, returning default analysis')
      return {
        isMisinformation: false,
        confidence: 0.5,
        type: 'authentic',
        severity: 'low',
        reasoning: 'Analysis unavailable - API key not configured',
        redFlags: [],
        claims: []
      }
    }
    
    const prompt = `You are an expert misinformation analyst specializing in election-related content. Analyze the following article for potential misinformation, false claims, or misleading information.

Title: ${content.title}
Description: ${content.description || 'N/A'}
URL: ${content.url}
Content: ${content.content_text?.substring(0, 1500) || 'N/A'}

Provide your analysis in the following JSON format:
{
  "isMisinformation": boolean,
  "confidence": number (0.00 to 1.00),
  "type": "deepfake" | "false_claim" | "misleading" | "satire" | "conspiracy" | "authentic",
  "severity": "low" | "medium" | "high" | "critical",
  "reasoning": "detailed explanation",
  "redFlags": ["flag1", "flag2"],
  "claims": ["claim1", "claim2"]
}

Consider:
- Sensational headlines vs actual content
- Lack of credible sources
- Logical fallacies
- Emotional manipulation
- Factual inaccuracies
- Deepfake or manipulated media indicators
- Known conspiracy theories
- Satire that might be misconstrued

Be objective and evidence-based.`
    
    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized')
      }
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert misinformation detection system. Respond only with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
      
      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      return analysis
      
    } catch (error) {
      console.error('Error detecting misinformation:', error)
      return {
        isMisinformation: false,
        confidence: 0.5,
        type: 'authentic',
        severity: 'low',
        reasoning: 'Analysis failed',
        redFlags: [],
        claims: []
      }
    }
  }
}

