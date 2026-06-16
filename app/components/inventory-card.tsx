import { MapPin, Clock, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Strain } from '@/lib/data'
import { isNearExpiry } from '@/lib/data'

const TYPE: Record<string, { border: string; badge: string }> = {
  Sativa: { border: 'border-l-[#2D6A4F]', badge: 'bg-[#2D6A4F] text-white' },
  Indica: { border: 'border-l-[#1B4332]', badge: 'bg-[#1B4332] text-white' },
  Hybrid: { border: 'border-l-[#FF9F1C]', badge: 'bg-[#FF9F1C] text-white' },
}

export default function InventoryCard({ s }: { s: Strain }) {
  const expiryWarning = isNearExpiry(s.expiryDate)
  const formattedExpiry = new Date(s.expiryDate).toLocaleDateString('pl-PL')

  const t = TYPE[s.type]
  return (
    <Card className={`border-l-4 ${t?.border ?? 'border-l-slate-400'} hover:-translate-y-[3px] hover:shadow-xl transition-all duration-200 ease-out`}>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-base font-bold text-text-main mb-2 leading-tight">{s.name}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={t?.badge ?? 'bg-slate-500 text-white'}>{s.type}</Badge>
            <Badge className={s.inStock ? 'bg-[#2D6A4F] text-white' : 'bg-[#EF4444] text-white'}>
              {s.inStock ? 'Dostępny' : 'Brak'}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium">Importer</p>
          <p className="text-sm font-semibold text-text-main mt-0.5 truncate">{s.brand}</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] text-slate-400">THC</p>
            <p className="text-base font-bold text-[#1B4332] tabular-nums">{s.thc}%</p>
          </div>
          <div className="h-8 w-px bg-border-muted" />
          <div>
            <p className="text-[11px] text-slate-400">CBD</p>
            <p className="text-base font-bold text-[#40916C] tabular-nums">{s.cbd}%</p>
          </div>
        </div>

        <div className="bg-[#F8FAF9] rounded-xl px-4 py-3">
          <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Cena za gram</p>
          <p className="text-2xl font-black text-text-main tabular-nums">
            {s.pricePerGram.toFixed(2)}<span className="text-sm font-semibold ml-1">PLN</span>
          </p>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-[#1B4332] mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-main truncate">{s.pharmacy}</p>
            <p className="text-[11px] text-slate-400">{s.city}, woj. {s.voivodeship}</p>
            <p className="text-[10px] text-slate-300 mt-0.5 truncate">{s.address}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border-muted">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock size={12} />
            Data ważności
          </div>
          <Badge className={expiryWarning ? 'bg-[#FF9F1C] text-white' : 'bg-slate-100 text-slate-500'}>
            {expiryWarning && <AlertTriangle size={11} />}
            {formattedExpiry}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
