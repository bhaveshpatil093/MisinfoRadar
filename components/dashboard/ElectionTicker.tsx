'use client'

import { useMemo } from 'react'
import { electionTickerItems } from '@/lib/sample-data'
import { Badge } from '@/components/ui/badge'

export function ElectionTicker() {
  const items = useMemo(() => electionTickerItems, [])

  return (
    <div className="glass-panel border-white/10 bg-white/5 px-4 py-3">
      <div className="flex flex-wrap gap-4 text-sm text-white">
        {items.map((item) => (
          <div key={item.headline} className="flex flex-wrap items-center gap-2">
            <Badge className="border-white/10 bg-white/10 text-xs text-slate-200">
              {item.state}
            </Badge>
            <span className="font-semibold">{item.headline}</span>
            <span className="text-xs text-slate-300">{item.source}</span>
            <span className="text-xs text-blue-200">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

