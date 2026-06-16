import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase-server'
import { Building2, Package, Leaf, AlertTriangle, ChevronRight, TrendingDown } from 'lucide-react'

type InventoryRow = {
  id: string
  stock_level: number
  expiry_date: string
  strains:    { name: string } | null
  pharmacies: { name: string; city: string } | null
}

export default async function AdminPage() {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string
  const db   = await createServerClient()

  const [{ count: pharmacyCount }, { count: strainCount }, { count: inventoryCount }, { data: lowStockRaw }] =
    await Promise.all([
      db.from('pharmacies').select('*', { count: 'exact', head: true }),
      db.from('strains').select('*', { count: 'exact', head: true }),
      db.from('inventory').select('*', { count: 'exact', head: true }),
      db.from('inventory')
        .select('id, stock_level, expiry_date, strains(name), pharmacies(name, city)')
        .lte('stock_level', 5)
        .order('stock_level', { ascending: true })
        .limit(8),
    ])

  const lowStock = (lowStockRaw ?? []) as unknown as InventoryRow[]

  const STATS = [
    { label: 'Apteki',        value: pharmacyCount  ?? 0, icon: Building2, href: '/admin/pharmacies' },
    { label: 'Szczepy',       value: strainCount    ?? 0, icon: Leaf,      href: null },
    { label: 'Pozycje zapasów', value: inventoryCount ?? 0, icon: Package,  href: '/admin/inventory'  },
    { label: 'Niski stan (≤5)', value: lowStock.length,  icon: TrendingDown, href: '/admin/inventory', warn: true },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          {role === 'pharmacy_admin' ? 'Panel Apteki' : 'Przegląd platformy'}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Zielnik · Panel Administracyjny</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, href, warn }) => {
          const card = (
            <div className={`bg-white rounded-2xl border p-5 space-y-3 transition-shadow ${
              warn && value > 0 ? 'border-amber-200 bg-amber-50' : 'border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                warn && value > 0 ? 'bg-amber-100' : 'bg-primary/8'
              }`}>
                <Icon size={20} className={warn && value > 0 ? 'text-amber-600' : 'text-primary'} />
              </div>
              <p className={`text-3xl font-bold tabular-nums ${warn && value > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                {value}
              </p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          )
          return href
            ? <Link key={label} href={href}>{card}</Link>
            : <div key={label}>{card}</div>
        })}
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-700">Alerty niskiego stanu zapasów</h2>
          </div>
          <div className="bg-white rounded-2xl border border-amber-200 divide-y divide-slate-100 overflow-hidden">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.strains?.name ?? '—'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.pharmacies?.name ?? '—'} · {item.pharmacies?.city ?? '—'}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                  item.stock_level === 0
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.stock_level} szt.
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Szybkie akcje</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: '/admin/pharmacies', label: 'Zarządzaj aptekami',  sub: 'Lista, dodaj nową aptekę',          icon: Building2 },
            { href: '/admin/inventory',  label: 'Zarządzaj zapasami', sub: 'Aktualizuj stan i ceny',             icon: Package   },
          ].map(({ href, label, sub, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
