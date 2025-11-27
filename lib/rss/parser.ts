import Parser from 'rss-parser'
import { createClient } from '@/lib/supabase/client'
import type { RSSSource } from '@/lib/supabase/types'

const parser = new Parser()

export async function fetchAndStoreRSSFeeds() {
  const supabase = createClient()
  
  // Get all active RSS sources
  const { data: sources, error } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true)
  
  if (error) throw error
  
  if (!sources) return
  
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url)
      
      if (!feed.items) continue
      
      for (const item of feed.items) {
        if (!item.link) continue
        
        // Check if item already exists
        const { data: existing } = await supabase
          .from('content_items')
          .select('id')
          .eq('url', item.link)
          .single()
        
        if (!existing) {
          // Insert new content item
          await supabase.from('content_items').insert({
            source_id: source.id,
            title: item.title || '',
            description: item.contentSnippet || item.description || null,
            url: item.link,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            content_text: item.content || item.contentSnippet || null,
            scan_status: 'pending'
          })
        }
      }
      
      // Update last_fetched timestamp
      await supabase
        .from('rss_sources')
        .update({ 
          last_fetched: new Date().toISOString(),
          total_articles_fetched: (source.total_articles_fetched || 0) + (feed.items?.length || 0)
        })
        .eq('id', source.id)
        
    } catch (err) {
      console.error(`Error fetching RSS from ${source.name}:`, err)
    }
  }
}

