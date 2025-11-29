'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import type { ContentItem } from '@/lib/supabase/types'
export function ContentCard() {
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      return undefined
    }
  }, [])
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    loadContent()
    
    // Real-time subscription
    const channel = supabase
      .channel('content-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'content_items' },
        () => loadContent()
      )
      .subscribe()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadContent, 30000)
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])
  
  async function loadContent() {
    if (!supabase) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (error) {
        console.error('Error loading content items:', error)
      } else if (data) {
        setContentItems(data)
      }
    } catch (error) {
      console.error('Error loading content items:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'scanning': return 'bg-blue-100 text-blue-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }
  
  const getSeverityColor = (severity: string | null) => {
    if (!severity) return 'bg-gray-100 text-gray-700'
    switch (severity) {
      case 'critical': return 'bg-red-200 text-red-800'
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-orange-100 text-orange-700'
      case 'low': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Analyzed Content</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading content...
            </div>
          ) : contentItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No content items yet. Run the Monitor Agent to start scanning RSS feeds.
            </div>
          ) : (
            <div className="space-y-4">
              {contentItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(item.scan_status)}>
                        {item.scan_status}
                      </Badge>
                      {item.is_misinformation && (
                        <Badge className={getSeverityColor(item.severity_level)}>
                          {item.severity_level || 'misinformation'}
                        </Badge>
                      )}
                      {item.is_election_related && (
                        <Badge variant="outline">Election Related</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold mb-1 line-clamp-2">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {item.misinformation_confidence && (
                        <span>
                          Confidence: {(item.misinformation_confidence * 100).toFixed(0)}%
                        </span>
                      )}
                      {item.misinformation_type && (
                        <span className="capitalize">{item.misinformation_type}</span>
                      )}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-xs"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
