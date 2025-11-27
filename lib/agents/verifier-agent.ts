import { createClient } from '@/lib/supabase/client'
import { openai } from '@/lib/ai/openai-client'
import axios from 'axios'
import type { ContentItem } from '@/lib/supabase/types'

export class VerifierAgent {
  private supabase = createClient()
  
  async verifyContent(contentId: string) {
    const startTime = Date.now()
    
    try {
      // Get content with misinformation flag
      const { data: content } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .eq('is_misinformation', true)
        .single()
      
      if (!content) return
      
      // Extract claims
      const claims = await this.extractClaims(content)
      
      if (claims.length === 0) return
      
      // Verify each claim
      for (const claim of claims) {
        const verification = await this.verifyClaim(claim)
        
        // Store fact check result
        await this.supabase.from('fact_checks').insert({
          content_id: contentId,
          claim: claim,
          verdict: verification.verdict,
          confidence: verification.confidence,
          supporting_sources: verification.supportingSources || [],
          contradicting_sources: verification.contradictingSources || [],
          reasoning: verification.reasoning,
          evidence_quality: verification.evidenceQuality
        })
      }
      
      const processingTime = Date.now() - startTime
      
      // Log activity
      await this.supabase.from('agent_logs').insert({
        content_id: contentId,
        agent_name: 'verifier',
        action: 'verified',
        details: { claims_verified: claims.length },
        processing_time_ms: processingTime
      })
      
      console.log(`✅ Verifier Agent: Verified ${claims.length} claims for content ${contentId}`)
      
    } catch (error) {
      console.error('❌ Verifier Agent error:', error)
      throw error
    }
  }
  
  private async extractClaims(content: ContentItem): Promise<string[]> {
    if (!openai) {
      console.warn('OpenAI client not initialized, returning empty claims')
      return []
    }
    
    const prompt = `Extract specific, verifiable claims from this article. Focus on factual statements that can be fact-checked.

Title: ${content.title}
Content: ${content.content_text?.substring(0, 1000) || content.description || 'N/A'}

Return a JSON object with a "claims" array: {"claims": ["claim1", "claim2", "claim3"]}
Maximum 5 claims.`
    
    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized')
      }
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
      
      const result = JSON.parse(response.choices[0].message.content || '{"claims":[]}')
      return result.claims || []
      
    } catch (error) {
      console.error('Error extracting claims:', error)
      return []
    }
  }
  
  private async verifyClaim(claim: string) {
    if (!openai) {
      return {
        verdict: 'unverified',
        confidence: 0,
        supportingSources: [],
        contradictingSources: [],
        reasoning: 'Verification unavailable - API key not configured',
        evidenceQuality: 'weak'
      }
    }
    // Search fact-checking databases
    const factCheckResults = await this.searchFactCheckers(claim)
    
    // Use LLM to analyze evidence
    const prompt = `You are a fact-checking expert. Verify the following claim using the provided sources.

Claim: "${claim}"

Sources found:
${JSON.stringify(factCheckResults, null, 2)}

Provide verification in JSON format:
{
  "verdict": "true" | "false" | "misleading" | "unverified" | "satire",
  "confidence": number (0.00 to 1.00),
  "supportingSources": [{"url": "...", "title": "...", "credibility": "...", "excerpt": "..."}],
  "contradictingSources": [{"url": "...", "title": "...", "credibility": "...", "excerpt": "..."}],
  "reasoning": "detailed explanation",
  "evidenceQuality": "strong" | "moderate" | "weak"
}`
    
    try {
      if (!openai) {
        throw new Error('OpenAI client not initialized')
      }
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
      
      return JSON.parse(response.choices[0].message.content || '{}')
      
    } catch (error) {
      console.error('Error verifying claim:', error)
      return {
        verdict: 'unverified',
        confidence: 0,
        supportingSources: [],
        contradictingSources: [],
        reasoning: 'Verification failed',
        evidenceQuality: 'weak'
      }
    }
  }
  
  private async searchFactCheckers(claim: string) {
    // In production, integrate with:
    // - Google Fact Check API
    // - ClaimBuster API
    // - Full Fact API
    // For now, return empty array
    try {
      // Example: Use Google Fact Check API if key is available
      if (process.env.GOOGLE_FACTCHECK_API_KEY) {
        const response = await axios.get('https://factchecktools.googleapis.com/v1alpha1/claims:search', {
          params: {
            query: claim,
            key: process.env.GOOGLE_FACTCHECK_API_KEY
          }
        })
        
        return response.data.claims || []
      }
      
      return []
    } catch (error) {
      return []
    }
  }
}

