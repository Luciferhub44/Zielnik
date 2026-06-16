'use client'

import { useEffect, useState, useTransition, useActionState } from 'react'
import { Package, AlertTriangle, CheckCircle2, AlertCircle, Plus, X, Minus } from 'lucide-react'
import { updateInventoryStock, addInventoryItem } from '@/app/actions/admin'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const INPUT = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white'

type InventoryItem = {
  id: string
  stock_level: number
  price_per_gram: number
  expiry_date: string
  batch_number: string | null
  strains:    { name: string; thc_pct: number; cbd_pct: number } | null
  pharmacies: { name: string; city: string } | null
}

export default function InventoryPage() {
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [pharmacies, setPharmacies] = useState<{ id: string; name: string }[]>([])
  const [strains, setStrains]     = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading]     = useState(true)
  const [filterPharmacy, setFilter] = useState('all')
  const [showAdd, setShowAdd]     = useState(false)
  const router = useRouter()

  const [addState, addAction, addPending] = useActionState(addInventoryItem, null)

  useEffect(() => {
    if (addState?.success) { setShowAdd(false); router.refresh(); fetchAll() }
  }, [addState])

  async function fetchAll() {
    const [{ data: inv }, { data: pharm }, { data: str }] = await Promise.all([
      supabase.from('inventory').select('id, stock_level, price_per_gram, expiry_date, batch_number, strains(name, thc_pct, cbd_pct), pharmacies(name, city)').order('stock_level', { ascending: true }),
      supabase.from('pharmacies').select('id, name').order('name'),
      supabase.from('strains').select('id, name').order('name'),
    ])
    setItems((inv ?? []) as unknown as InventoryItem[])
    setPharmacies(pharm ?? [])
    setStrains(str ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = filterPharmacy === 'all'
    ? items
    : items.filter(i => i.pharmacies?.name === filterPharmacy)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Zapasy</h1>
          <p className="text-sm text-slate-400 mt-0.5">{items.length} pozycji łącznie</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterPharmacy}
            onChange={e => setFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]"
          >
            <option value="all">Wszystkie apteki</option>
            {pharmacies.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <button
            onClick={() => setShowAdd(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] transition-colors ${
              showAdd ? 'bg-slate-100 text-slate-600' : 'bg-primary text-white hover:bg-primary-light'
            }`}
          >
            {showAdd ? <><X size={14} /> Anuluj</> : <><Plus size={14} /> Dodaj</>}
          </button>
        </div>
      </div>

      {/* Add inventory form */}
      {showAdd && (
        <form action={addAction} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Nowa pozycja zapasów</h2>
          {addState?.error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle size={15} /> {addState.error}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Apteka *</label>
              <select name="pharmacy_id" required className={INPUT}>
                <option value="">Wybierz aptekę…</option>
                {pharmacies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Szczep *</label>
              <select name="strain_id" required className={INPUT}>
                <option value="">Wybierz szczep…</option>
                {strains.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Cena / gram (PLN) *</label>
              <input name="price_per_gram" type="number" step="0.01" min="0" required placeholder="32.50" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Stan magazynowy (g) *</label>
              <input name="stock_level" type="number" min="0" required placeholder="100" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Data ważności *</label>
              <input name="expiry_date" type="date" required className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Numer partii</label>
              <input name="batch_number" type="text" placeholder="LOT-2024-001" className={INPUT} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">Wymaga SUPABASE_SERVICE_ROLE_KEY</p>
            <button type="submit" disabled={addPending}
              className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors min-h-[44px]">
              {addPending ? 'Dodaję…' : 'Dodaj pozycję'}
            </button>
          </div>
        </form>
      )}

      {/* Inventory table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <Package size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Brak pozycji</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_1fr_80px_100px_100px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            <span>Szczep</span>
            <span>Apteka</span>
            <span>Cena</span>
            <span>Stan (g)</span>
            <span>Ważność</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map(item => (
              <InventoryRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InventoryRow({ item }: { item: InventoryItem }) {
  const [stock, setStock]   = useState(item.stock_level)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [, startT]          = useTransition()

  const isLow     = stock <= 5
  const isExpired = new Date(item.expiry_date) < new Date()

  async function handleStockChange(delta: number) {
    const next = Math.max(0, stock + delta)
    setStock(next)
    setSaving(true)
    startT(async () => {
      await updateInventoryStock(item.id, next)
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    })
  }

  return (
    <div className={`flex flex-col sm:grid sm:grid-cols-[1fr_1fr_80px_100px_100px] gap-2 sm:gap-4 items-start sm:items-center px-5 py-4 ${isLow ? 'bg-amber-50/40' : ''}`}>
      {/* Strain */}
      <div>
        <p className="text-sm font-semibold text-slate-800">{item.strains?.name ?? '—'}</p>
        <p className="text-xs text-slate-400">{item.strains?.thc_pct}% THC · {item.strains?.cbd_pct}% CBD</p>
      </div>

      {/* Pharmacy */}
      <div>
        <p className="text-sm text-slate-700">{item.pharmacies?.name ?? '—'}</p>
        <p className="text-xs text-slate-400">{item.pharmacies?.city}</p>
      </div>

      {/* Price */}
      <p className="text-sm font-medium text-slate-700 tabular-nums">{item.price_per_gram} PLN</p>

      {/* Stock editor */}
      <div className="flex items-center gap-1.5">
        <button onClick={() => handleStockChange(-1)} disabled={stock === 0 || saving}
          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
          <Minus size={12} />
        </button>
        <span className={`text-sm font-bold tabular-nums w-8 text-center ${isLow ? 'text-amber-600' : 'text-slate-800'}`}>
          {stock}
        </span>
        <button onClick={() => handleStockChange(1)} disabled={saving}
          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
          <Plus size={12} />
        </button>
        {saved   && <CheckCircle2  size={13} className="text-green-500 shrink-0" />}
        {isLow   && !saved && <AlertTriangle size={13} className="text-amber-500 shrink-0" />}
      </div>

      {/* Expiry */}
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
        isExpired ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {new Date(item.expiry_date).toLocaleDateString('pl-PL')}
      </span>
    </div>
  )
}
