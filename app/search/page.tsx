'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import SearchBar from '@/app/components/search-bar'
import InventoryList from '@/app/components/inventory-list'
import { supabase } from '@/lib/supabase'
import { fetchStrains, filterStrains, type Strain, type FilterType } from '@/lib/data'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [allStrains, setAllStrains] = useState<Strain[]>([])

  useEffect(() => {
    fetchStrains(supabase).then(setAllStrains)

    // Realtime: refresh when any inventory row changes
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory' }, () => {
        fetchStrains(supabase).then(setAllStrains)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const results = filterStrains(allStrains, query, filter)

  return (
    <div className="min-h-dvh bg-bg-medical pt-14">

      {/* Page hero */}
      <div className="relative h-36 sm:h-48 overflow-hidden">
        <Image
          src="/pharmacy-interior.png"
          alt="Wnętrze apteki"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/90" />
        <div className="absolute inset-0 flex items-end max-w-6xl mx-auto px-4 sm:px-6 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Wyszukaj preparat</h1>
            <p className="text-sm text-white/60 mt-0.5">
              {results.length} {results.length === 1 ? 'wynik' : 'wyników'} · dane na żywo
            </p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-surface border-b border-border-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <SearchBar query={query} filter={filter} onQuery={setQuery} onFilter={setFilter} />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <InventoryList strains={results} />
      </div>
    </div>
  )
}
