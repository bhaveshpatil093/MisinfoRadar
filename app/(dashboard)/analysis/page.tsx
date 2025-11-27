'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

type FeedItem = {
  source: string
  title: string
  link?: string
  publishedAt?: string
  verdict: 'deepfake_suspected' | 'likely_real'
  score: number
  reasons: string[]
}

export default function AnalysisPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([])
  const [loadingFeeds, setLoadingFeeds] = useState(true)
  const [content, setContent] = useState('')
  const [analysis, setAnalysis] = useState<null | {
    verdict: 'deepfake_suspected' | 'likely_real'
    score: number
    reasons: string[]
  }>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchFeeds = useCallback(
    async (showToast = false) => {
      setLoadingFeeds(true)
      try {
        const res = await fetch('/api/analysis/feed')
        const data = await res.json()
        setFeeds(data.items || [])
        if (showToast) toast.success('Feeds refreshed')
      } catch {
        setFeeds([])
        toast.error('Unable to refresh feeds')
      } finally {
        setLoadingFeeds(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchFeeds()
    const timer = setInterval(() => fetchFeeds(), 60000)
    return () => clearInterval(timer)
  }, [fetchFeeds])

  const handleAnalyze = async () => {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/analysis/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      setAnalysis(data.result)
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass-panel border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Deepfake Desk</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Live RSS + Manual Analysis</h1>
        <p className="mt-2 text-sm text-slate-300">
          Pulls from ABP Live, Zee News, Republic World, India TV, CNN, DD News, and Hindustan Times.
          Paste any article or transcript to estimate deepfake risk instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-panel border-white/10 bg-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Live Feed Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Auto-refresh every 60s</span>
              <button
                onClick={() => {
                  fetchFeeds(true)
                }}
                className="rounded-full border border-white/10 px-3 py-1 text-white hover:bg-white/10"
              >
                Refresh now
              </button>
            </div>
            {loadingFeeds ? (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading RSS feeds…
              </div>
            ) : feeds.length === 0 ? (
              <p className="text-sm text-slate-400">
                Unable to fetch feeds right now. Check the RSS endpoints.
              </p>
            ) : (
              feeds.map((item) => (
                <div
                  key={`${item.source}-${item.title}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-white">{item.title}</div>
                    <Badge
                      className={`border-none ${
                        item.verdict === 'deepfake_suspected'
                          ? 'bg-red-500/20 text-red-200'
                          : 'bg-green-500/20 text-green-200'
                      }`}
                    >
                      {item.verdict} · {item.score}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    {item.source} · {item.publishedAt ?? 'Unknown time'}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 0.6 ? 'bg-red-500/60' : 'bg-emerald-500/60'
                      }`}
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                  <ul className="mt-2 text-xs text-slate-300">
                    {item.reasons.map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Manual Analyzer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-200">
            <textarea
              className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              placeholder="Paste article URL or content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleAnalyze} disabled={submitting || !content.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                'Analyze realism'
              )}
            </Button>
            {analysis && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                <p className="text-sm text-white">
                  Verdict:{' '}
                  <span className="font-semibold">
                    {analysis.verdict === 'deepfake_suspected' ? 'Deepfake suspected' : 'Likely real'}
                  </span>
                </p>
                <p>Score: {analysis.score}</p>
                <ul className="mt-2">
                  {analysis.reasons.map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

