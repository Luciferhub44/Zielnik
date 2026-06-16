'use client'

import { useActionState, useState } from 'react'
import { Building2, MapPin, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { addPharmacy } from '@/app/actions/admin'
import { useEffect } from 'react'

// ponytail: static pharmacy data for now; swap to server component + revalidatePath once service role key is set
import { useRouter } from 'next/navigation'

const INPUT = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white'

export default function PharmaciesPage() {
  const [showForm, setShowForm] = useState(false)
  const [state, action, pending] = useActionState(addPharmacy, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      setShowForm(false)
      router.refresh()
    }
  }, [state, router])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Apteki</h1>
          <p className="text-sm text-slate-400 mt-0.5">Zarządzaj siecią aptek na platformie</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
            showForm ? 'bg-slate-100 text-slate-600' : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          {showForm ? <><X size={15} /> Anuluj</> : <><Plus size={15} /> Dodaj aptekę</>}
        </button>
      </div>

      {/* Add pharmacy form */}
      {showForm && (
        <form action={action} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Nowa apteka</h2>
          {state?.error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle size={15} /> {state.error}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Nazwa apteki *</label>
              <input name="name" type="text" required placeholder="Apteka Medyczna Oliva" className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Adres *</label>
              <input name="address" type="text" required placeholder="ul. Grunwaldzka 1" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Miasto *</label>
              <input name="city" type="text" required placeholder="Gdańsk" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Województwo *</label>
              <input name="voivodeship" type="text" required placeholder="Pomorskie" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Szerokość geogr.</label>
              <input name="latitude" type="number" step="0.000001" placeholder="54.352025" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Długość geogr.</label>
              <input name="longitude" type="number" step="0.000001" placeholder="18.646638" className={INPUT} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">Wymaga SUPABASE_SERVICE_ROLE_KEY</p>
            <button type="submit" disabled={pending}
              className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors min-h-[44px]">
              {pending ? 'Dodaję…' : 'Dodaj aptekę'}
            </button>
          </div>
        </form>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={15} /> Apteka dodana pomyślnie.
        </div>
      )}

      {/* Pharmacy list placeholder — fetched client-side via useEffect to avoid blocking layout */}
      <PharmacyList />
    </div>
  )
}

function PharmacyList() {
  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase
        .from('pharmacies')
        .select('id, name, address, city, voivodeship')
        .order('name')
        .then(({ data }) => {
          setPharmacies(data ?? [])
          setLoading(false)
        })
    })
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse h-20" />
      ))}
    </div>
  )

  if (pharmacies.length === 0) return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
      <Building2 size={32} className="text-slate-300 mx-auto mb-3" />
      <p className="text-sm font-medium text-slate-500">Brak aptek</p>
      <p className="text-xs text-slate-400 mt-1">Dodaj pierwszą aptekę powyżej.</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
      {pharmacies.map((p) => (
        <div key={p.id} className="flex items-center gap-4 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin size={10} />
              {p.address} · {p.city} · woj. {p.voivodeship}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono truncate hidden sm:block max-w-[120px]">{p.id.slice(0, 8)}…</span>
        </div>
      ))}
    </div>
  )
}
