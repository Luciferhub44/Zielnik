'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { Leaf, Plus, X, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { addStrain, deleteStrain } from '@/app/actions/admin'
import { supabase } from '@/lib/supabase'
import { INPUT } from '@/app/admin/styles'

type Strain = {
  id: string
  name: string
  producer: string
  thc_pct: number
  cbd_pct: number
  lineage: string | null
  created_at: string
}

const LINEAGE_OPTIONS = ['Sativa', 'Indica', 'Hybrid', 'Sativa-dominant', 'Indica-dominant']

const TYPE_BADGE: Record<string, string> = {
  'Sativa':           'bg-amber-100 text-amber-700',
  'Sativa-dominant':  'bg-amber-100 text-amber-700',
  'Indica':           'bg-violet-100 text-violet-700',
  'Indica-dominant':  'bg-violet-100 text-violet-700',
  'Hybrid':           'bg-teal-100 text-teal-700',
}

export default function StrainsPage() {
  const [showForm, setShowForm] = useState(false)
  const [strains, setStrains] = useState<Strain[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [, startDelete] = useTransition()

  const [state, action, pending] = useActionState(addStrain, null)

  async function fetchStrains() {
    const { data } = await supabase
      .from('strains')
      .select('id, name, producer, thc_pct, cbd_pct, lineage, created_at')
      .order('name')
    setStrains(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchStrains() }, [])

  useEffect(() => {
    if (state?.success) { setShowForm(false); fetchStrains() }
  }, [state])

  function handleDelete(id: string) {
    setDeleting(id)
    setDeleteError('')
    setConfirmTarget(null)
    startDelete(async () => {
      const res = await deleteStrain(id)
      if (res?.error) { setDeleteError(res.error); setDeleting(null) }
      else { setDeleting(null); fetchStrains() }
    })
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Zarządzanie</p>
          <h1 className="text-2xl font-black text-slate-800">Szczepy</h1>
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
            : <span className="flex items-center gap-2"><Plus size={15} /> Dodaj szczep</span>
          }
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Leaf size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-slate-700">Nowy szczep</h2>
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
                  Nazwa <span className="text-red-400">*</span>
                </label>
                <input name="name" type="text" required placeholder="Aurora 22/1" className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Producent <span className="text-red-400">*</span>
                </label>
                <input name="producer" type="text" required placeholder="Aurora Cannabis" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  THC % <span className="text-red-400">*</span>
                </label>
                <input name="thc_pct" type="number" step="0.1" min="0" max="40" required placeholder="22" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  CBD % <span className="text-red-400">*</span>
                </label>
                <input name="cbd_pct" type="number" step="0.1" min="0" max="40" required placeholder="1" className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Typ</label>
                <select name="lineage" className={INPUT}>
                  <option value="">Wybierz typ…</option>
                  {LINEAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={pending}
                className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
                {pending ? 'Dodaję…' : 'Dodaj szczep'}
              </button>
            </div>
          </form>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={15} /> Szczep dodany pomyślnie.
        </div>
      )}

      {deleteError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} /> {deleteError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-2">
          <Leaf size={15} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-700">
            {loading ? 'Ładowanie…' : `${strains.length} szczepów`}
          </span>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : strains.length === 0 ? (
          <div className="py-16 text-center">
            <Leaf size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Brak szczepów</p>
            <p className="text-xs text-slate-400 mt-1">Dodaj pierwszy szczep używając przycisku powyżej.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {strains.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <Leaf size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                    {s.lineage && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[s.lineage] ?? 'bg-slate-100 text-slate-500'}`}>
                        {s.lineage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {s.producer} · THC {s.thc_pct}% · CBD {s.cbd_pct}%
                  </p>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-300 font-mono shrink-0">
                  {new Date(s.created_at).toLocaleDateString('pl-PL')}
                </p>
                <button
                  onClick={() => setConfirmTarget({ id: s.id, name: s.name })}
                  disabled={deleting === s.id}
                  aria-label={`Usuń ${s.name}`}
                  className="shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
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
                <p className="font-bold text-slate-800 text-base">Usuń szczep</p>
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
                {deleting === confirmTarget.id ? 'Usuwam…' : 'Usuń szczep'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
