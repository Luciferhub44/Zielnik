import { MapPin, Clock, Package, AlertTriangle } from 'lucide-react'
import type { Strain } from '@/lib/data'
import { isNearExpiry } from '@/lib/data'

/* ─── design tokens per strain type ─── */
const TYPE: Record<string, { border: string; badge: string; dot: string }> = {
  Sativa: {
    border: 'border-l-primary-light',
    badge:  'bg-primary-light/12 text-primary-light',
    dot:    'bg-primary-light',
  },
  Indica: {
    border: 'border-l-primary',
    badge:  'bg-primary/12 text-primary',
    dot:    'bg-primary',
  },
  Hybrid: {
    border: 'border-l-amber-500',
    badge:  'bg-amber-500/10 text-amber-700',
    dot:    'bg-amber-500',
  },
}

/* ─── sub-components ─── */
function StockPill({ inStock }: { inStock: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
      inStock
        ? 'bg-status-success/10 text-status-success'
        : 'bg-status-error/10 text-status-error'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-status-success' : 'bg-status-error'}`} aria-hidden />
      {inStock ? 'Dostępny' : 'Brak'}
    </span>
  )
}

function ExpiryBadge({ date }: { date: string }) {
  const near = isNearExpiry(date)
  const formatted = new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
      near
        ? 'bg-accent/12 text-amber-700 ring-1 ring-amber-400/30'
        : 'bg-slate-100 text-slate-400'
    }`}>
      {near ? <AlertTriangle size={11} className="shrink-0" /> : <Clock size={11} className="shrink-0" />}
      {formatted}
      {near && <span className="font-semibold">· wygasa wkrótce</span>}
    </span>
  )
}

/* ─── card ─── */
function StrainCard({ s }: { s: Strain }) {
  const t = TYPE[s.type]

  return (
    <li className={`
      group relative bg-surface rounded-2xl border border-border-muted border-l-4 ${t.border}
      p-4 sm:p-5 space-y-3.5
      transition-all duration-200 ease-out
      hover:-translate-y-[3px] hover:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.12)]
      cursor-default
    `}>
      {/* Top row — name + price */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          {/* Type badge + name */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${t.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} aria-hidden />
              {s.type}
            </span>
            <StockPill inStock={s.inStock} />
          </div>
          <p className="font-bold text-text-main text-base leading-tight">{s.name}</p>
          <p className="text-xs text-slate-400 font-medium">{s.brand}</p>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-primary tabular-nums leading-none">
            {s.pricePerGram}
            <span className="text-sm font-semibold ml-0.5">zł</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">za gram</p>
        </div>
      </div>

      {/* THC / CBD ratio bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-8">THC</span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-light transition-all"
              style={{ width: `${Math.min(s.thc * 4, 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-text-main tabular-nums w-8 text-right">{s.thc}%</span>
        </div>
        <div className="flex-1 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-8">CBD</span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${Math.min(s.cbd * 4, 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-text-main tabular-nums w-8 text-right">{s.cbd}%</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-muted/60" />

      {/* Bottom row — location + expiry */}
      <div className="space-y-2">
        <div className="flex items-start gap-1.5">
          <MapPin size={13} className="text-primary-light mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-text-main">{s.pharmacy}</p>
            <p className="text-[11px] text-slate-400">{s.address} · {s.city}, {s.voivodeship}</p>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <ExpiryBadge date={s.expiryDate} />
          <span className="text-[11px] text-slate-300 font-medium">#{s.id}</span>
        </div>
      </div>
    </li>
  )
}

/* ─── empty state ─── */
function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center">
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

/* ─── list ─── */
export default function InventoryList({ strains }: { strains: Strain[] }) {
  if (!strains.length) return <EmptyState />

  return (
    <ul className="space-y-3">
      {strains.map((s) => <StrainCard key={s.id} s={s} />)}
    </ul>
  )
}
