import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import {
  Building2, MapPin, Package, ChevronLeft, ExternalLink,
  Phone, Mail, Globe, Clock, AlertTriangle, Pencil,
} from 'lucide-react'

type InventoryRow = {
  id: string
  stock_level: number
  price_per_gram: number
  expiry_date: string
  batch_number: string | null
  strains: { name: string; thc_pct: number; cbd_pct: number } | null
}

export default async function PharmacyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()
  const [{ data: pharmacy }, { data: inv }] = await Promise.all([
    db.from('pharmacies').select('*').eq('id', id).maybeSingle(),
    db.from('inventory')
      .select('id, stock_level, price_per_gram, expiry_date, batch_number, strains(name, thc_pct, cbd_pct)')
      .eq('pharmacy_id', id)
      .order('stock_level', { ascending: true }),
  ])

  if (!pharmacy) notFound()

  const items = (inv ?? []) as unknown as InventoryRow[]
  const zeroStock = items.filter(i => i.stock_level === 0).length
  const lowStock  = items.filter(i => i.stock_level > 0 && i.stock_level <= 5).length

  const mapsUrl = pharmacy.latitude && pharmacy.longitude
    ? `https://www.google.com/maps?q=${pharmacy.latitude},${pharmacy.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pharmacy.address}, ${pharmacy.city}`)}`

  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <Link href="/admin/pharmacies" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
          <ChevronLeft size={15} /> Wszystkie apteki
        </Link>
        <Link
          href={`/admin/pharmacies/${id}/edit`}
          className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Pencil size={13} /> Edytuj
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-8 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Building2 size={26} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white leading-tight">{pharmacy.name}</h1>
              <p className="text-white/60 text-sm mt-1">{pharmacy.city} · woj. {pharmacy.voivodeship}</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="px-6 py-5 space-y-2 sm:col-span-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Adres</p>
            <p className="text-sm font-semibold text-slate-800">{pharmacy.address}</p>
            <p className="text-sm text-slate-500">{pharmacy.city}, woj. {pharmacy.voivodeship}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-1"
            >
              <MapPin size={11} /> Otwórz w Mapach <ExternalLink size={10} />
            </a>
          </div>

          <div className="px-6 py-5 space-y-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Kontakt</p>
            <div className="space-y-2">
              {pharmacy.phone ? (
                <a href={`tel:${pharmacy.phone}`} className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                  <Phone size={13} className="text-slate-400 shrink-0" />
                  {pharmacy.phone}
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Phone size={13} />
                  <span className="italic">Brak telefonu</span>
                </div>
              )}
              {pharmacy.email ? (
                <a href={`mailto:${pharmacy.email}`} className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                  <Mail size={13} className="text-slate-400 shrink-0" />
                  {pharmacy.email}
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail size={13} />
                  <span className="italic">Brak e-maila</span>
                </div>
              )}
              {pharmacy.website ? (
                <a href={pharmacy.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                  <Globe size={13} className="text-slate-400 shrink-0" />
                  {pharmacy.website.replace(/^https?:\/\//, '')}
                  <ExternalLink size={10} className="text-slate-300" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Globe size={13} />
                  <span className="italic">Brak strony WWW</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={15} className="text-primary" />
            <h2 className="text-sm font-bold text-slate-700">Zapasy apteki</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{items.length} pozycji</span>
            {zeroStock > 0 && (
              <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                {zeroStock} wyczerpane
              </span>
            )}
            {lowStock > 0 && (
              <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                {lowStock} niski stan
              </span>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-14 text-center">
            <Package size={28} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Brak zapasów</p>
            <p className="text-xs text-slate-400 mt-1">Dodaj pozycje w <Link href="/admin/inventory" className="text-primary hover:underline">Zapasach</Link>.</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_80px_90px_110px_120px] px-5 py-3 bg-slate-50 border-b border-slate-100">
              {['Szczep', 'THC/CBD', 'PLN/g', 'Stan', 'Ważność'].map(h => (
                <p key={h} className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{h}</p>
              ))}
            </div>
            <div className="divide-y divide-slate-50">
              {items.map(item => {
                const days = Math.ceil((new Date(item.expiry_date).getTime() - Date.now()) / 86_400_000)
                return (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_90px_110px_120px] items-center gap-2 sm:gap-0 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.strains?.name ?? '—'}</p>
                      {item.batch_number && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.batch_number}</p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {item.strains?.thc_pct ?? 0}% / {item.strains?.cbd_pct ?? 0}%
                    </p>
                    <p className="text-sm font-semibold text-slate-700 tabular-nums">
                      {item.price_per_gram}<span className="text-slate-400 font-normal text-xs"> PLN</span>
                    </p>
                    <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full tabular-nums w-fit ${
                      item.stock_level === 0 ? 'bg-red-100 text-red-700' :
                      item.stock_level <= 5  ? 'bg-amber-100 text-amber-700' :
                                               'bg-green-100 text-green-700'
                    }`}>
                      {item.stock_level === 0 && <AlertTriangle size={11} className="mr-1" />}
                      {item.stock_level}g
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border tabular-nums w-fit ${
                      days < 0   ? 'bg-red-50 text-red-600 border-red-200' :
                      days < 30  ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                   'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <Clock size={10} />
                      {days < 0 ? 'Wygasło' : new Date(item.expiry_date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

    </div>
  )
}
