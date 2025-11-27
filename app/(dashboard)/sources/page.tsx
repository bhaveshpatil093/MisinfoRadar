'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const defaultSources = [
  {
    category: 'Maharashtra / India',
    feeds: [
      'NDTV Politics',
      'Aaj Tak Election',
      'ABP News Election',
      'Times of India',
      'Hindustan Times',
      'DD News Political',
    ],
  },
  {
    category: 'Fact-checkers',
    feeds: ['Alt News', 'Boom Live', 'FactCheck.org', 'PolitiFact'],
  },
  {
    category: 'International',
    feeds: ['BBC Politics', 'Reuters Politics', 'CNN All Politics'],
  },
]

export default function SourcesPage() {
  const [form, setForm] = useState({ name: '', url: '', category: 'election_news' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.url) {
      toast.error('Name and URL required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/sources/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add source')
      }
      toast.success('Source added — Monitor Agent will pick it up next sweep.')
      setForm({ name: '', url: '', category: 'election_news' })
    } catch (error: any) {
      toast.error(error.message || 'Unable to add source (check Supabase creds).')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass-panel border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Source Registry</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">RSS Sources</h1>
        <p className="mt-2 text-sm text-slate-300">
          24 feeds across mainstream media, fact-checkers, and global desks feed the Monitor Agent
          for Maharashtra coverage.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {defaultSources.map((group) => (
          <Card key={group.category} className="glass-panel border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">{group.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.feeds.map((feed) => (
                <div
                  key={feed}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {feed}
                  <Badge className="border-white/10 bg-white/10 text-xs text-slate-300">
                    Active
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Add New Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              placeholder="Source name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none md:col-span-2"
              placeholder="https://example.com/rss"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-white">
            {['election_news', 'mainstream_media', 'fact_checkers'].map((cat) => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className={`rounded-full border px-3 py-1 ${
                  form.category === cat ? 'border-blue-400 bg-blue-500/20' : 'border-white/10'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full md:w-auto">
            {submitting ? 'Adding…' : 'Add Source'}
          </Button>
          <p className="text-xs text-slate-400">
            Requires Supabase credentials (.env). Entries go to `rss_sources` table and will be
            swept by the Monitor Agent on the next cycle.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

