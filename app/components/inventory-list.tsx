import { Package } from 'lucide-react'
import type { Strain } from '@/lib/data'
import InventoryCard from './inventory-card'

function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center col-span-full">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Package size={24} className="text-slate-300" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-text-main">Brak wyników</p>
        <p className="text-sm text-slate-400 max-w-xs">
          Spróbuj zmienić filtry lub wpisz inną frazę wyszukiwania.
        </p>
      </div>
    </div>
  )
}

export default function InventoryList({ strains }: { strains: Strain[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {strains.length === 0
        ? <EmptyState />
        : strains.map((s) => <InventoryCard key={s.id} s={s} />)
      }
    </div>
  )
}
