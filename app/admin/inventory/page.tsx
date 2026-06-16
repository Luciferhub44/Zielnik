'use client'

import { useEffect, useState, useTransition, useActionState } from 'react'
import {
  Package, AlertTriangle, CheckCircle2, AlertCircle,
  Plus, X, Minus, ChevronDown, Search,
} from 'lucide-react'
import { updateInventoryStock, addInventoryItem } from '@/app/actions/admin'
import { supabase } from '@/lib/supabase'

const INPUT = [
  'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800',
  'placeholder:text-slate-400 bg-white',
  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60',
  'transition-all duration-150',
].join(' ')

type Item = {
  id: string
  stock_level: number
  price_per_gram: number
  expiry_date: string
  batch_number: string | null
  strains:    { id: string; name: string; thc_pct: number; cbd_pct: number } | null
  pharmacies: { id: string; name: string; city: string } | null
}

function stockColor(n: number) {
  if (n === 0)  return 'bg-red-100    text-red-700'
  if (n <= 3)   return 'bg-orange-100 text-orange-700'
  if (n <= 10)  return 'bg-amber-100  text-amber-700'
  return              'bg-green-100  text-green-700'
}

function expiryLabel(d: string) {
  const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
  if (days < 0)   return { text: 'Wygasło',       cls: 'text-red-600   bg-red-50   border-red-200'   }
  if (days < 30)  return { text: `${days}d`,       cls: 'text-amber-700 bg-amber-50 border-amber-200' }
  return               { text: new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: '2-digit' }), cls: 'text-slate-500 bg-slate-50 border-slate-200' }
}

export default function InventoryPage() {
  const [items,      setItems]      = useState<Item[]>([])
  const [pharmacies, setPharmacies] = useState<{ id: string; name: string }[]>([])
  const [strains,    setStrains]    = useState<{ id: string; name: string }[]>([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('all')
  const [search,     setSearch]     = useState('')
  const [showAdd,    setShowAdd]    = useState(false)

  const [addState, addAction, addPending] = useActionState(addInventoryItem, null)

  useEffect(() => { if (addState?.success) { setShowAdd(false); fetchAll() } }, [addState])

  async function fetchAll() {
    setLoading(true)
    const [{ data: inv }, { data: ph }, { data: st }] = await Promise.all([
      supabase.from('inventory')
        .select('id, stock_level, price_per_gram, expiry_date, batch_number, strains(id, name, thc_pct, cbd_pct), pharmacies(id, name, city)')
        .order('stock_level', { ascending: true }),
      supabase.from('pharmacies').select('id, name').order('name'),
      supabase.from('strains').select('id, name').order('name'),
    ])
    setItems((inv ?? []) as unknown as Item[])
    setPharmacies(ph ?? [])
    setStrains(st ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = items.filter(i => {
    const matchPharm = filter === 'all' || i.pharmacies?.id === filter
    const matchSearch = !search || i.strains?.name.toLowerCase().includes(search.toLowerCase())
    return matchPharm && matchSearch
  })

  const zeroCount = items.filter(i => i.stock_level === 0).length
  const lowCount  = items.filter(i => i.stock_level > 0 && i.stock_level <= 5).length

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto space-y-6">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Zarządzanie</p>
          <h1 className="text-2xl font-black text-slate-800">Zapasy</h1>
          {!loading && (
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-slate-400">{items.length} pozycji</span>
              {zeroCount > 0 && <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{zeroCount} wyczerpane</span>}
              {lowCount  > 0 && <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{lowCount} niski stan</span>}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            showAdd ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-primary text-white hover:bg-primary-light shadow-sm shadow-primary/20'
          }`}
        >
          {showAdd
            ? <span className="flex items-center gap-2"><X size={15} /> Anuluj</span>
            : <span className="flex items-center gap-2"><Plus size={15} /> Dodaj pozycję</span>
          }
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Package size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-slate-700">Nowa pozycja zapasów</h2>
          </div>
          <form action={addAction} className="px-6 py-5 space-y-4">
            {addState?.error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0 mt-0.5" /> {addState.error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Apteka <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select name="pharmacy_id" required className={INPUT + ' appearance-none pr-9'}>
                    <option value="">Wybierz aptekę…</option>
                    {pharmacies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Szczep <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select name="strain_id" required className={INPUT + ' appearance-none pr-9'}>
                    <option value="">Wybierz szczep…</option>
                    {strains.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Cena / gram (PLN) <span className="text-red-400">*</span></label>
                <input name="price_per_gram" type="number" step="0.01" min="0" required placeholder="32.50" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Stan (g) <span className="text-red-400">*</span></label>
                <input name="stock_level" type="number" min="0" required placeholder="100" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Data ważności <span className="text-red-400">*</span></label>
                <input name="expiry_date" type="date" required className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Nr partii</label>
                <input name="batch_number" type="text" placeholder="LOT-2025-001" className={INPUT} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-400">* Wymaga SUPABASE_SERVICE_ROLE_KEY</p>
              <button type="submit" disabled={addPending}
                className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
                {addPending ? 'Dodaję…' : 'Dodaj pozycję'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Szukaj szczepu…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] cursor-pointer transition-all"
          >
            <option value="all">Wszystkie apteki</option>
            {pharmacies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-[1fr_180px_80px_130px_110px] gap-0 px-5 py-3 bg-slate-50 border-b border-slate-200">
          {['Szczep / Apteka', 'Apteka', 'PLN/g', 'Stan magazynowy', 'Ważność'].map(h => (
            <p key={h} className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{h}</p>
          ))}
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Brak pozycji</p>
            {search && <p className="text-xs text-slate-400 mt-1">Brak wyników dla &quot;{search}&quot;</p>}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(item => <InventoryRow key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function InventoryRow({ item }: { item: Item }) {
  const [stock,   setStock]   = useState(item.stock_level)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')
  const [, startT] = useTransition()

  async function applyStock(next: number) {
    if (next === stock) return
    setSaving(true)
    setError('')
    startT(async () => {
      const res = await updateInventoryStock(item.id, next)
      setSaving(false)
      if (res?.error) { setError(res.error); setStock(item.stock_level) }
      else { setStock(next); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    })
  }

  const exp = expiryLabel(item.expiry_date)

  return (
    <div className="group hover:bg-slate-50/60 transition-colors">
      <div className="hidden sm:grid sm:grid-cols-[1fr_180px_80px_130px_110px] gap-0 items-center px-5 py-3.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{item.strains?.name ?? '—'}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            THC {item.strains?.thc_pct ?? 0}% · CBD {item.strains?.cbd_pct ?? 0}%
          </p>
        </div>
        <div className="min-w-0 pr-4">
          <p className="text-sm text-slate-700 truncate">{item.pharmacies?.name ?? '—'}</p>
          <p className="text-xs text-slate-400">{item.pharmacies?.city}</p>
        </div>
        <p className="text-sm font-semibold text-slate-700 tabular-nums">{item.price_per_gram}<span className="text-slate-400 font-normal text-xs"> PLN</span></p>
        <StockEditor stock={stock} saving={saving} saved={saved} error={error}
          onDecrement={() => applyStock(Math.max(0, stock - 1))}
          onIncrement={() => applyStock(stock + 1)}
          onInput={v    => applyStock(Math.max(0, v))}
        />
        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${exp.cls} tabular-nums`}>
          {exp.text}
        </span>
      </div>

      <div className="sm:hidden px-5 py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{item.strains?.name ?? '—'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.pharmacies?.name ?? '—'} · {item.price_per_gram} PLN/g</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${stockColor(stock)}`}>
            {stock}g
          </span>
        </div>
        <div className="flex items-center justify-between">
          <StockEditor stock={stock} saving={saving} saved={saved} error={error}
            onDecrement={() => applyStock(Math.max(0, stock - 1))}
            onIncrement={() => applyStock(stock + 1)}
            onInput={v    => applyStock(Math.max(0, v))}
          />
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${exp.cls}`}>{exp.text}</span>
        </div>
        {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      </div>
    </div>
  )
}

function StockEditor({
  stock, saving, saved, error,
  onDecrement, onIncrement, onInput,
}: {
  stock: number; saving: boolean; saved: boolean; error: string
  onDecrement: () => void; onIncrement: () => void; onInput: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onDecrement} disabled={stock === 0 || saving}
        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-30 transition-all cursor-pointer"
        aria-label="Zmniejsz stan">
        <Minus size={12} />
      </button>

      <input
        type="number"
        value={stock}
        min={0}
        onChange={e => onInput(parseInt(e.target.value) || 0)}
        onBlur={e => onInput(parseInt(e.target.value) || 0)}
        disabled={saving}
        className={`w-14 text-center text-sm font-bold tabular-nums rounded-lg border py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all disabled:opacity-50 ${
          stock === 0 ? 'border-red-200 text-red-700 bg-red-50' :
          stock <= 5  ? 'border-amber-200 text-amber-700 bg-amber-50' :
                        'border-slate-200 text-slate-800 bg-white'
        }`}
      />

      <button onClick={onIncrement} disabled={saving}
        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-30 transition-all cursor-pointer"
        aria-label="Zwiększ stan">
        <Plus size={12} />
      </button>

      <div className="w-5 flex items-center justify-center">
        {saved   && <CheckCircle2  size={14} className="text-green-500 animate-in fade-in duration-200" />}
        {saving  && <div className="w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />}
        {!saved && !saving && stock <= 5 && stock > 0 && <AlertTriangle size={13} className="text-amber-400" />}
        {!saved && !saving && stock === 0 && <AlertTriangle size={13} className="text-red-400" />}
      </div>

      {error && (
        <span className="hidden sm:flex items-center gap-1 text-xs text-red-600 ml-1">
          <AlertCircle size={11} />{error.slice(0, 40)}
        </span>
      )}
    </div>
  )
}
