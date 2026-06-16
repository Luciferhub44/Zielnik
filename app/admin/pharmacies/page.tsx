'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Building2, MapPin, Plus, X, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { addPharmacy, deletePharmacy } from '@/app/actions/admin'
import { supabase } from '@/lib/supabase'

const INPUT = [
  'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800',
  'placeholder:text-slate-400 bg-white',
  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60',
  'transition-all duration-150',
].join(' ')

type Pharmacy = { id: string; name: string; address: string; city: string; voivodeship: string; created_at: string }

export default function PharmaciesPage() {
  const { user } = useUser()
  const isAppAdmin = user?.publicMetadata?.role === 'admin'

  const [showForm, setShowForm] = useState(false)
  const [state, action, pending] = useActionState(addPharmacy, null)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)
  const [sortAsc, setSortAsc] = useState(true)
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [, startDelete] = useTransition()

  async function fetchPharmacies() {
    const { data } = await supabase
      .from('pharmacies')
      .select('id, name, address, city, voivodeship, created_at')
      .order('name', { ascending: sortAsc })
    setPharmacies(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPharmacies() }, [sortAsc])

  useEffect(() => {
    if (state?.success) {
      setShowForm(false)
      fetchPharmacies()
    }
  }, [state])

  function handleDelete(id: string) {
    setDeleting(id)
    setDeleteError('')
    setConfirmTarget(null)
    startDelete(async () => {
      const res = await deletePharmacy(id)
      if (res?.error) { setDeleteError(res.error); setDeleting(null) }
      else { setDeleting(null); fetchPharmacies() }
    })
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Zarządzanie</p>
          <h1 className="text-2xl font-black text-slate-800">Apteki</h1>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 min-h-[44px] ${
            showForm
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-primary text-white hover:bg-primary-light shadow-sm shadow-primary/20'
          }`}
        >
          {showForm
            ? <span className="flex items-center gap-2"><X size={15} /> Anuluj</span>
            : <span className="flex items-center gap-2"><Plus size={15} /> Dodaj aptekę</span>
          }
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-slate-700">Nowa apteka</h2>
          </div>
          <form action={action} className="px-6 py-5 space-y-4">
            {state?.error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Nazwa apteki <span className="text-red-400">*</span>
                </label>
                <input name="name" type="text" required placeholder="Apteka Medyczna Oliva" className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Adres <span className="text-red-400">*</span>
                </label>
                <input name="address" type="text" required placeholder="ul. Grunwaldzka 1" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Miasto <span className="text-red-400">*</span>
                </label>
                <input name="city" type="text" required placeholder="Gdańsk" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Województwo <span className="text-red-400">*</span>
                </label>
                <input name="voivodeship" type="text" required placeholder="Pomorskie" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Szerokość geogr.</label>
                <input name="latitude" type="number" step="0.000001" placeholder="54.352025" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Długość geogr.</label>
                <input name="longitude" type="number" step="0.000001" placeholder="18.646638" className={INPUT} />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Kontakt</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Telefon</label>
                  <input name="phone" type="tel" placeholder="+48 123 456 789" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">E-mail</label>
                  <input name="email" type="email" placeholder="apteka@example.pl" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Strona WWW</label>
                  <input name="website" type="url" placeholder="https://apteka.pl" className={INPUT} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-400">* Pola wymagane · wymaga SUPABASE_SERVICE_ROLE_KEY</p>
              <button type="submit" disabled={pending}
                className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
                {pending ? 'Dodaję…' : 'Dodaj aptekę'}
              </button>
            </div>
          </form>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={15} /> Apteka dodana pomyślnie.
        </div>
      )}

      {deleteError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} /> {deleteError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 size={15} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-700">
              {loading ? 'Ładowanie…' : `${pharmacies.length} aptek`}
            </span>
          </div>
          <button
            onClick={() => setSortAsc(v => !v)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            Sortuj A–Z
            {sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Brak aptek</p>
            <p className="text-xs text-slate-400 mt-1">Dodaj pierwszą aptekę używając przycisku powyżej.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pharmacies.map(p => (
              <div key={p.id} className="relative flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
                <Link href={`/admin/pharmacies/${p.id}`} className="absolute inset-0" aria-label={p.name} />
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <Building2 size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {p.address} · {p.city} · woj. {p.voivodeship}
                  </p>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-300 font-mono shrink-0">
                  {new Date(p.created_at).toLocaleDateString('pl-PL')}
                </p>
                {isAppAdmin && (
                  <button
                    onClick={() => setConfirmTarget({ id: p.id, name: p.name })}
                    disabled={deleting === p.id}
                    aria-label={`Usuń ${p.name}`}
                    className="relative z-10 shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-base">Usuń aptekę</p>
                <p className="text-sm text-slate-500 mt-0.5">Tej operacji nie można cofnąć.</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-semibold">
              {confirmTarget.name}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors min-h-[44px]"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDelete(confirmTarget.id)}
                disabled={deleting === confirmTarget.id}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {deleting === confirmTarget.id ? 'Usuwam…' : 'Usuń aptekę'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
