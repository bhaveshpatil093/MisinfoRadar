import Parser from 'rss-parser'
import { analyzeContent } from '@/lib/analysis/analyzer'

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

const rssSources = [
  { name: 'ABP Elections', url: 'https://www.abplive.com/elections/feed' },
  { name: 'Zee News National', url: 'https://zeenews.india.com/rss/india-national-news.xml' },
  { name: 'Republic Politics', url: 'https://www.republicworld.com/rss/politics.xml' },
  { name: 'Republic Elections', url: 'https://www.republicworld.com/rss/elections.xml' },
  { name: 'India TV Politics', url: 'https://www.indiatvnews.com/rssnews/topstory-politics.xml' },
  { name: 'CNN Politics', url: 'http://rss.cnn.com/rss/cnn_allpolitics.rss' },
  { name: 'DD News Political', url: 'https://ddnewsportal.com/rss/category/Political' },
  { name: 'Hindustan Times India', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' },
]

export async function fetchAnalyzedFeeds(limit = 12): Promise<FeedItemAnalysis[]> {
  const results: FeedItemAnalysis[] = []

  for (const source of rssSources) {
    try {
      const feed = await parser.parseURL(source.url)
      feed.items.slice(0, 2).forEach((item) => {
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
      console.error(`Failed to parse feed ${source.name}`, error)
    }
  }

  return results.slice(0, limit)
}

export async function analyzeManualInput(content: string) {
  return analyzeContent({ content })
}

