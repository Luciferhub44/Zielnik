import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase-server'
import {
  Building2, Package, Leaf, AlertTriangle,
  ChevronRight, TrendingDown, Activity, ArrowUpRight,
} from 'lucide-react'

type InventoryRow = {
  id: string
  stock_level: number
  expiry_date: string
  price_per_gram: number
  strains:    { name: string; thc_pct: number } | null
  pharmacies: { name: string; city: string } | null
}

export default async function AdminPage() {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string
  const db   = createAdminClient()

  const [
    { count: pharmacyCount },
    { count: strainCount },
    { count: inventoryCount },
    { data: lowStockRaw },
    { data: recentPharmacies },
  ] = await Promise.all([
    db.from('pharmacies').select('*', { count: 'exact', head: true }),
    db.from('strains').select('*', { count: 'exact', head: true }),
    db.from('inventory').select('*', { count: 'exact', head: true }),
    db.from('inventory')
      .select('id, stock_level, expiry_date, price_per_gram, strains(name, thc_pct), pharmacies(name, city)')
      .lte('stock_level', 5)
      .order('stock_level', { ascending: true })
      .limit(10),
    db.from('pharmacies').select('id, name, city, voivodeship, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const lowStock = (lowStockRaw ?? []) as unknown as InventoryRow[]

  const STATS = [
    { label: 'Apteki',           value: pharmacyCount  ?? 0, icon: Building2,   href: '/admin/pharmacies', color: 'bg-blue-500/8   text-blue-600',  border: 'border-blue-100'  },
    { label: 'Szczepy (strains)', value: strainCount   ?? 0, icon: Leaf,        href: null,                color: 'bg-green-500/8  text-green-600', border: 'border-green-100' },
    { label: 'Pozycje zapasów',  value: inventoryCount ?? 0, icon: Package,     href: '/admin/inventory',  color: 'bg-violet-500/8 text-violet-600', border: 'border-violet-100'},
    { label: 'Niski stan (≤5g)', value: lowStock.length,     icon: TrendingDown, href: '/admin/inventory', color: lowStock.length > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/8 text-slate-500', border: lowStock.length > 0 ? 'border-amber-200' : 'border-slate-100', warn: lowStock.length > 0 },
  ]

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Panel administracyjny</p>
          <h1 className="text-2xl font-black text-slate-800">
            {role === 'pharmacy_admin' ? 'Panel Apteki' : 'Przegląd platformy'}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity size={13} className="text-green-500" />
          <span>Na żywo</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, href, color, border, warn }) => {
          const card = (
            <div className={`bg-white rounded-2xl border ${border} p-5 sm:p-6 group transition-shadow hover:shadow-md cursor-default`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                {href && (
                  <ArrowUpRight size={15} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                )}
              </div>
              <p className={`text-4xl font-black tabular-nums leading-none ${warn ? 'text-amber-700' : 'text-slate-800'}`}>
                {value}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-2 leading-tight">{label}</p>
            </div>
          )
          return href
            ? <Link key={label} href={href} className="block">{card}</Link>
            : <div key={label}>{card}</div>
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className={lowStock.length > 0 ? 'text-amber-500' : 'text-slate-300'} />
              <h2 className="text-sm font-bold text-slate-700">Alerty niskiego stanu</h2>
            </div>
            <Link href="/admin/inventory" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Wszystkie <ChevronRight size={12} />
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Package size={18} className="text-green-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Wszystkie zapasy OK</p>
              <p className="text-xs text-slate-400 mt-1">Żadna pozycja nie osiągnęła progu 5g.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
              {lowStock.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-5 py-3.5 gap-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.strains?.name ?? '—'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.pharmacies?.name ?? '—'} · {item.pharmacies?.city ?? '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full tabular-nums ${
                      item.stock_level === 0
                        ? 'bg-red-100 text-red-700'
                        : item.stock_level <= 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.stock_level}g
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700">Ostatnie apteki</h2>
            </div>
            <Link href="/admin/pharmacies" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Wszystkie <ChevronRight size={12} />
            </Link>
          </div>

          {!recentPharmacies?.length ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <Building2 size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">Brak aptek</p>
              <Link href="/admin/pharmacies" className="text-xs text-primary mt-2 block hover:underline">+ Dodaj pierwszą aptekę</Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              {recentPharmacies.map((p, i) => (
                <div key={p.id}
                  className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                  <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    <Building2 size={15} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.city} · woj. {p.voivodeship}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
