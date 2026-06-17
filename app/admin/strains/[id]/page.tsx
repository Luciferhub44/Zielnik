import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Leaf, Pencil, FlaskConical } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase-server'

const BORDER: Record<string, string> = {
  'Sativa':          'from-amber-500/20 to-amber-500/5',
  'Sativa-dominant': 'from-amber-500/20 to-amber-500/5',
  'Indica':          'from-violet-600/20 to-violet-600/5',
  'Indica-dominant': 'from-violet-600/20 to-violet-600/5',
  'Hybrid':          'from-teal-500/20 to-teal-500/5',
}

const BADGE: Record<string, string> = {
  'Sativa':          'bg-amber-100 text-amber-700',
  'Sativa-dominant': 'bg-amber-100 text-amber-700',
  'Indica':          'bg-violet-100 text-violet-700',
  'Indica-dominant': 'bg-violet-100 text-violet-700',
  'Hybrid':          'bg-teal-100 text-teal-700',
}

export default async function StrainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()
  const { data: strain } = await db
    .from('strains')
    .select('*')
    .eq('id', id)
    .single()

  if (!strain) notFound()

  const gradient = BORDER[strain.lineage ?? ''] ?? 'from-slate-200/40 to-slate-100/10'
  const badge    = BADGE[strain.lineage ?? '']

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-6">

      <div className="flex items-center justify-between">
        <Link
          href="/admin/strains"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors"
        >
          <ChevronLeft size={15} /> Szczepy
        </Link>
        <Link
          href={`/admin/strains/${id}/edit`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          <Pencil size={13} /> Edytuj
        </Link>
      </div>

      <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden border border-slate-200 shadow-sm`}>
        <div className="aspect-square w-full relative">
          {strain.image_url ? (
            <Image
              src={strain.image_url}
              alt={strain.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 672px"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
              <Leaf size={48} />
              <span className="text-sm font-medium">Brak zdjęcia</span>
            </div>
          )}
        </div>

        <div className="px-6 py-5 space-y-1 bg-white/80 backdrop-blur-sm border-t border-slate-200/60">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-black text-slate-800">{strain.name}</h1>
              <p className="text-sm text-slate-400 mt-0.5">{strain.producer}</p>
            </div>
            {strain.lineage && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badge}`}>
                {strain.lineage}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">THC</p>
          <p className="text-3xl font-black text-[#1B4332] tabular-nums">{strain.thc_pct}<span className="text-lg font-semibold ml-0.5">%</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">CBD</p>
          <p className="text-3xl font-black text-[#40916C] tabular-nums">{strain.cbd_pct}<span className="text-lg font-semibold ml-0.5">%</span></p>
        </div>
      </div>

      {strain.dominant_terpenes && strain.dominant_terpenes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={15} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Dominujące terpeny</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {strain.dominant_terpenes.map(t => (
              <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-300 text-right font-mono">
        Dodano {new Date(strain.created_at).toLocaleDateString('pl-PL')}
      </p>

    </div>
  )
}
