'use client'

import { Search } from 'lucide-react'
import type { FilterType } from '@/lib/data'

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Sativa', value: 'Sativa' },
  { label: 'Indica', value: 'Indica' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'THC >20%', value: 'high-thc' },
  { label: '1:1 CBD', value: 'balanced' },
]

type Props = {
  query: string
  filter: FilterType
  onQuery: (q: string) => void
  onFilter: (f: FilterType) => void
}

export default function SearchBar({ query, filter, onQuery, onFilter }: Props) {
  return (
    <div className="space-y-3">
      <label htmlFor="strain-search" className="sr-only">Szukaj preparatu</label>
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-light pointer-events-none" />
        <input
          id="strain-search"
          type="search"
          placeholder="Nazwa, marka lub stosunek THC/CBD…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-muted bg-surface text-text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px] touch-manipulation"
        />
      </div>

      {/* Scrollable pills on mobile, wrapping on larger screens */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-hide"
        role="group"
        aria-label="Filtry"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer min-h-[36px] whitespace-nowrap touch-manipulation ${
              filter === f.value
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-main border-border-muted hover:border-primary-light active:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
