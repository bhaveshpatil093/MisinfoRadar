import { createClient } from '@/lib/supabase/client'
import { TwitterClient } from '@/lib/apis/twitter-client'
import { YouTubeClient } from '@/lib/apis/youtube-client'
import type { ContentItem } from '@/lib/supabase/types'

export class TracerAgent {
  private supabase: ReturnType<typeof createClient> | null = null
  private twitterClient: TwitterClient | null = null
  private youtubeClient: YouTubeClient | null = null
  
  constructor() {
    try {
      this.supabase = createClient()
      this.twitterClient = new TwitterClient()
      this.youtubeClient = new YouTubeClient()
    } catch (error) {
      console.warn('TracerAgent: Failed to initialize clients', error)
    }
  }
  
  async traceContent(contentId: string) {
    const startTime = Date.now()
    
    if (!this.supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    try {
      // Get content item
      const { data: content } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single()
      
      if (!content) return
      
      // Analyze spread pattern
      const trace = await this.analyzeSpread(content)
      
      // Store trace result
      if (!this.supabase) return
      
      await this.supabase.from('source_traces').insert({
        content_id: contentId,
        original_source: trace.originalSource,
        first_seen_at: trace.firstSeenAt,
        spread_pattern: trace.spreadPattern,
        sharing_accounts: trace.sharingAccounts,
        geographic_spread: trace.geographicSpread,
        platform_distribution: trace.platformDistribution,
        is_deepfake: trace.isDeepfake,
        deepfake_confidence: trace.deepfakeConfidence,
        manipulation_type: trace.manipulationType
      })
      
      const processingTime = Date.now() - startTime
      
      // Log activity
      if (!this.supabase) return
      
      await this.supabase.from('agent_logs').insert({
        content_id: contentId,
        agent_name: 'tracer',
        action: 'traced',
        details: trace,
        processing_time_ms: processingTime
      })
      
      console.log(`🔍 Tracer Agent: Traced content ${contentId}`)
      
      return trace
      
    } catch (error) {
      console.error('❌ Tracer Agent error:', error)
      throw error
    }
  }
  
  private async analyzeSpread(content: ContentItem) {
    const results = {
      originalSource: content.url,
      firstSeenAt: content.published_at || content.created_at,
      spreadPattern: 'organic' as 'viral' | 'coordinated' | 'organic' | 'bot_amplified',
      sharingAccounts: [] as any[],
      geographicSpread: [] as any[],
      platformDistribution: [] as any[],
      isDeepfake: false,
      deepfakeConfidence: 0,
      manipulationType: null as string | null
    }

    try {
      // 1. Search Twitter/X for mentions of this URL
      const twitterResults = this.twitterClient 
        ? await this.twitterClient.searchByUrl(content.url)
        : []
      
      if (twitterResults.length > 0) {
        results.platformDistribution.push({
          platform: 'twitter',
          shares: twitterResults.length,
          accounts: twitterResults.map((tweet: any) => ({
            tweetId: tweet.id,
            authorId: tweet.author_id,
            createdAt: tweet.created_at,
            metrics: tweet.public_metrics,
          })),
        })

        // Analyze if it's viral or coordinated
        const totalEngagement = twitterResults.reduce((sum: number, tweet: any) => {
          return sum + (tweet.public_metrics?.retweet_count || 0) + 
                      (tweet.public_metrics?.like_count || 0) +
                      (tweet.public_metrics?.reply_count || 0)
        }, 0)

        const viralThreshold = parseInt(process.env.VIRAL_ENGAGEMENT_THRESHOLD || '1000')
        const botThreshold = parseInt(process.env.BOT_AMPLIFICATION_THRESHOLD || '20')
        const botEngagementRatio = parseFloat(process.env.BOT_ENGAGEMENT_RATIO || '10')

        if (totalEngagement > viralThreshold) {
          results.spreadPattern = 'viral'
        } else if (twitterResults.length > botThreshold && totalEngagement / twitterResults.length < botEngagementRatio) {
          results.spreadPattern = 'bot_amplified'
        }

        results.sharingAccounts.push(...twitterResults.map((tweet: any) => ({
          platform: 'twitter',
          accountId: tweet.author_id,
          tweetId: tweet.id,
          sharedAt: tweet.created_at,
        })))
      }

      // 2. Search YouTube for related videos
      const searchQuery = `${content.title} election`
      const youtubeLimit = parseInt(process.env.YOUTUBE_SEARCH_LIMIT || '5')
      const youtubeResults = this.youtubeClient
        ? await this.youtubeClient.searchVideos(searchQuery, youtubeLimit)
        : []
      
      if (youtubeResults.length > 0) {
        results.platformDistribution.push({
          platform: 'youtube',
          videos: youtubeResults.length,
          videoIds: youtubeResults.map((item: any) => item.id.videoId),
        })

        // Check if any videos might be deepfakes
        if (this.youtubeClient) {
          for (const video of youtubeResults.slice(0, 3)) {
            const videoDetails = await this.youtubeClient.getVideoDetails(video.id.videoId)
            if (videoDetails) {
              // Check for suspicious patterns (high views, low engagement ratio might indicate manipulation)
              const viewCount = parseInt(videoDetails.statistics?.viewCount || '0')
              const likeCount = parseInt(videoDetails.statistics?.likeCount || '0')
              const engagementRatio = viewCount > 0 ? likeCount / viewCount : 0
              
              const deepfakeEngagementThreshold = parseFloat(process.env.DEEPFAKE_ENGAGEMENT_THRESHOLD || '0.01')
              const deepfakeViewThreshold = parseInt(process.env.DEEPFAKE_VIEW_THRESHOLD || '10000')
              
              if (engagementRatio < deepfakeEngagementThreshold && viewCount > deepfakeViewThreshold) {
                results.isDeepfake = true
                results.deepfakeConfidence = 0.6
                results.manipulationType = 'suspicious_engagement_pattern'
              }
            }
          }
        }
      }

      // 3. Extract keywords and search for related content
      const keywords = content.keywords || []
      if (keywords.length > 0 && this.twitterClient) {
        const keywordQuery = keywords.slice(0, 3).join(' ')
        const twitterLimit = parseInt(process.env.TWITTER_SEARCH_LIMIT || '10')
        const relatedTweets = await this.twitterClient.searchTweets(keywordQuery, twitterLimit)
        
        const coordinatedThreshold = parseInt(process.env.COORDINATED_TWEET_THRESHOLD || '5')
        if (relatedTweets.length > coordinatedThreshold) {
          results.spreadPattern = 'coordinated'
        }
      }

      // 4. Geographic analysis (based on Twitter trends)
      let indiaTrends: any[] = []
      let worldwideTrends: any[] = []
      
      if (this.twitterClient) {
        const indiaWOEID = parseInt(process.env.TWITTER_INDIA_WOEID || '23424848')
        const worldwideWOEID = parseInt(process.env.TWITTER_WORLDWIDE_WOEID || '1')
        indiaTrends = await this.twitterClient.getTrendingTopics(indiaWOEID)
        worldwideTrends = await this.twitterClient.getTrendingTopics(worldwideWOEID)
      }
      
      const contentKeywords = content.title.toLowerCase().split(' ')
      const isTrending = [...indiaTrends, ...worldwideTrends].some((trend: any) => 
        contentKeywords.some((keyword: string) => trend.name?.toLowerCase().includes(keyword))
      )

      if (isTrending) {
        results.geographicSpread.push({
          region: process.env.DEFAULT_COUNTRY || 'India',
          isTrending: true,
        })
      }

    } catch (error) {
      console.error('Error in spread analysis:', error)
      // Continue with basic analysis
    }

    return results
  }
}

