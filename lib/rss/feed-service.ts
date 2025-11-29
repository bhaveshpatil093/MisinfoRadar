import Parser from 'rss-parser'
import { analyzeContent } from '@/lib/analysis/analyzer'
import { createClient as createServerClient } from '@/lib/supabase/server'

const parser = new Parser()

export type FeedItemAnalysis = {
  source: string
  title: string
  link?: string
  publishedAt?: string
  verdict: 'deepfake_suspected' | 'likely_real'
  score: number
  reasons: string[]
}

export async function fetchAnalyzedFeeds(limit: number = parseInt(process.env.RSS_FEED_LIMIT || '12')): Promise<FeedItemAnalysis[]> {
  const results: FeedItemAnalysis[] = []
  const supabase = await createServerClient()
  const itemsPerSource = parseInt(process.env.RSS_ITEMS_PER_SOURCE || '2')

  try {
    // Fetch RSS sources from database instead of hardcoded array
    const { data: rssSources, error } = await supabase
      .from('rss_sources')
      .select('*')
      .eq('is_active', true)
      .order('credibility_score', { ascending: false })

    if (error) {
      console.error('Error fetching RSS sources:', error)
      return []
    }

    if (!rssSources || rssSources.length === 0) {
      console.warn('No active RSS sources found in database')
      return []
    }

    for (const source of rssSources) {
      try {
        const feed = await parser.parseURL(source.url)
        feed.items?.slice(0, itemsPerSource).forEach((item) => {
          const analysis = analyzeContent({
            title: item.title ?? undefined,
            description: item.contentSnippet ?? item.content ?? undefined,
          })

          results.push({
            source: source.name,
            title: item.title ?? 'Untitled item',
            link: item.link,
            publishedAt: item.pubDate,
            verdict: analysis.verdict,
            score: analysis.score,
            reasons: analysis.reasons,
          })
        })
      } catch (error) {
        console.error(`Failed to parse feed ${source.name}:`, error)
      }
    }

    return results.slice(0, limit)
  } catch (error) {
    console.error('Error in fetchAnalyzedFeeds:', error)
    return []
  }
}

export async function analyzeManualInput(content: string) {
  return analyzeContent({ content })
}

