import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Pencil, Trash2 } from 'lucide-react'

export type StrainData = {
  id: string
  name: string
  producer: string
  thc_pct: number
  cbd_pct: number
  lineage: string | null
  image_url: string | null
}

const BORDER: Record<string, string> = {
  'Sativa':          'border-l-amber-500',
  'Sativa-dominant': 'border-l-amber-500',
  'Indica':          'border-l-violet-600',
  'Indica-dominant': 'border-l-violet-600',
  'Hybrid':          'border-l-teal-500',
}

const BADGE: Record<string, string> = {
  'Sativa':          'bg-amber-100 text-amber-700',
  'Sativa-dominant': 'bg-amber-100 text-amber-700',
  'Indica':          'bg-violet-100 text-violet-700',
  'Indica-dominant': 'bg-violet-100 text-violet-700',
  'Hybrid':          'bg-teal-100 text-teal-700',
}

export default function StrainCard({
  strain,
  onEdit,
  onDelete,
  deleting,
}: {
  strain: StrainData
  onEdit: (strain: StrainData) => void
  onDelete: (id: string, name: string) => void
  deleting: boolean
}) {
  const border = BORDER[strain.lineage ?? ''] ?? 'border-l-slate-300'
  const badge  = BADGE[strain.lineage ?? '']

  return (
    <div className={`group relative bg-white rounded-2xl border border-slate-200 border-l-4 ${border} shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden`}>
      <Link href={`/admin/strains/${strain.id}`} className="absolute inset-0 z-0" aria-label={strain.name} />

      <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        {strain.image_url ? (
          <Image
            src={strain.image_url}
            alt={strain.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <Leaf size={32} />
            <span className="text-xs font-medium">Brak zdjęcia</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={e => { e.preventDefault(); onEdit(strain) }}
            aria-label={`Edytuj ${strain.name}`}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-slate-400 hover:text-primary hover:bg-primary/8 transition-colors shadow-sm"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={e => { e.preventDefault(); onDelete(strain.id, strain.name) }}
            disabled={deleting}
            aria-label={`Usuń ${strain.name}`}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 shadow-sm"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative z-0 p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">{strain.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{strain.producer}</p>
        </div>

        {strain.lineage && (
          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge}`}>
            {strain.lineage}
          </span>
        )}

        <div className="flex items-center gap-4 pt-1 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">THC</p>
            <p className="text-base font-black text-[#1B4332] tabular-nums">{strain.thc_pct}%</p>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">CBD</p>
            <p className="text-base font-black text-[#40916C] tabular-nums">{strain.cbd_pct}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
