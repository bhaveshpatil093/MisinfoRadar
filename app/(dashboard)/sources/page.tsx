import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sources = [
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
        {sources.map((group) => (
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
          <p>
            To onboard new feeds, open Supabase SQL editor and insert into `rss_sources`. Ensure the
            category matches one of `mainstream_media`, `election_news`, `fact_checkers`.
          </p>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-slate-400">
            <p>Example:</p>
            <code className="block whitespace-pre-wrap break-all text-slate-200">
              INSERT INTO rss_sources (name, url, category, credibility_score)
              VALUES ('Zee News Election', 'https://zeenews.india.com/rss/india-national-news.xml',
              'election_news', 0.76);
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

