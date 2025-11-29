'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Hashtag = {
  tag: string
  volume: string
  sentiment: string
}

export function DynamicHashtags() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      return undefined
    }
  }, [])
  
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadHashtags()
    const interval = setInterval(loadHashtags, 120000) // Refresh every 2 minutes
    
    return () => clearInterval(interval)
  }, [supabase])
  
  async function loadHashtags() {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Extract hashtags from content items keywords
      const { data: contentItems } = await supabase
        .from('content_items')
        .select('keywords, is_misinformation, misinformation_type, spread_pattern')
        .not('keywords', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (!contentItems || contentItems.length === 0) {
        setHashtags([])
        return
      }
      
      // Extract hashtags from keywords
      const hashtagMap: Record<string, { count: number; misinformation: number; coordinated: number }> = {}
      
      contentItems.forEach(item => {
        if (item.keywords && Array.isArray(item.keywords)) {
          item.keywords.forEach((keyword: string) => {
            if (keyword.startsWith('#')) {
              const tag = keyword.toLowerCase()
              if (!hashtagMap[tag]) {
                hashtagMap[tag] = { count: 0, misinformation: 0, coordinated: 0 }
              }
              hashtagMap[tag].count++
              if (item.is_misinformation) {
                hashtagMap[tag].misinformation++
              }
              if (item.spread_pattern === 'coordinated' || item.spread_pattern === 'bot_amplified') {
                hashtagMap[tag].coordinated++
              }
            }
          })
        }
      })
      
      // Convert to array and format
      const hashtagArray: Hashtag[] = Object.entries(hashtagMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([tag, data]) => {
          const volume = data.count > 1000 
            ? `${(data.count / 1000).toFixed(1)}k mentions`
            : `${data.count} mentions`
          
          const misinfoPercent = data.count > 0 
            ? Math.round((data.misinformation / data.count) * 100)
            : 0
          const coordPercent = data.count > 0
            ? Math.round((data.coordinated / data.count) * 100)
            : 0
          
          let sentiment = `${100 - misinfoPercent}% neutral`
          if (misinfoPercent > 30) {
            sentiment = `${misinfoPercent}% misinformation flagged`
          } else if (coordPercent > 20) {
            sentiment = `${coordPercent}% coordinated`
          }
          
          return {
            tag: tag.charAt(0).toUpperCase() + tag.slice(1),
            volume,
            sentiment,
          }
        })
      
      setHashtags(hashtagArray)
    } catch (error) {
      console.error('Error loading hashtags:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-32 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-24 mb-1"></div>
            <div className="h-3 bg-white/10 rounded w-40"></div>
          </div>
        ))}
      </div>
    )
  }
  
  if (hashtags.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8 text-sm">
        No trending hashtags detected yet. Hashtags will appear here as content is analyzed.
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {hashtags.map((trend) => (
        <div key={trend.tag} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-lg font-semibold text-white">{trend.tag}</p>
          <p className="text-sm text-slate-300">{trend.volume}</p>
          <p className="text-xs text-slate-400">{trend.sentiment}</p>
        </div>
      ))}
    </div>
  )
}

