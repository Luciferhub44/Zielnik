'use client'

import { useEffect, useRef, useState, useTransition, useActionState } from 'react'
import { ImageIcon, Leaf, Plus, X, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { addStrain, updateStrain, deleteStrain } from '@/app/actions/admin'
import { supabase } from '@/lib/supabase'
import { INPUT } from '@/app/admin/styles'
import StrainCard, { type StrainData } from './strain-card'

type Strain = StrainData & { created_at: string }

const LINEAGE_OPTIONS = ['Sativa', 'Indica', 'Hybrid', 'Sativa-dominant', 'Indica-dominant']

function ImageUpload({ name = 'image', current, onChange }: {
  name?: string
  current?: string | null
  onChange: (url: string | null) => void
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    // Assign file to the input so FormData picks it up on submit
    if (inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
    }
    onChange(URL.createObjectURL(file))
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 w-full h-36 border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
    >
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="Podgląd" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      ) : (
        <>
          <ImageIcon size={24} className="text-slate-300 pointer-events-none" />
          <span className="text-xs text-slate-400 pointer-events-none">Kliknij lub przeciągnij zdjęcie</span>
          <span className="text-[11px] text-slate-300 pointer-events-none">JPG, PNG, WEBP · max 5 MB</span>
        </>
      )}
      <input
        ref={inputRef}
        name={name}
        type="file"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

export default function StrainsPage() {
  const [showForm, setShowForm]       = useState(false)
  const [strains, setStrains]         = useState<Strain[]>([])
  const [loading, setLoading]         = useState(true)
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting]       = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const [addPreview, setAddPreview]   = useState<string | null>(null)
  const addFormRef = useRef<HTMLFormElement>(null)
  const [addState, addAction, addPending] = useActionState(addStrain, null)

  const [editTarget, setEditTarget]   = useState<Strain | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(null)
  const [editError, setEditError]     = useState('')
  const [, startSave] = useTransition()
  const [saving, setSaving]           = useState(false)

  const [, startDelete] = useTransition()

  async function fetchStrains() {
    const { data } = await supabase
      .from('strains')
      .select('id, name, producer, thc_pct, cbd_pct, lineage, image_url, created_at')
      .order('name')
    setStrains(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchStrains() }, [])

  useEffect(() => {
    if (addState?.success) {
      setShowForm(false)
      setAddPreview(null)
      addFormRef.current?.reset()
      fetchStrains()
    }
  }, [addState])

  function openEdit(strain: StrainData) {
    setEditTarget(strain as Strain)
    setEditPreview(strain.image_url ?? null)
    setEditError('')
  }

  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editTarget) return
    const formData = new FormData(e.currentTarget)
    setSaving(true)
    setEditError('')
    startSave(async () => {
      const res = await updateStrain(editTarget.id, null, formData)
      setSaving(false)
      if (res?.error) { setEditError(res.error) }
      else { setEditTarget(null); setEditPreview(null); fetchStrains() }
    })
  }

  function handleDelete(id: string, name: string) {
    setConfirmTarget({ id, name })
  }

  function confirmDelete() {
    if (!confirmTarget) return
    const { id } = confirmTarget
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
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Zarządzanie</p>
          <h1 className="text-2xl font-black text-slate-800">Szczepy</h1>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setAddPreview(null) }}
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
          <form ref={addFormRef} action={addAction} className="px-6 py-5 space-y-4">
            {addState?.error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0 mt-0.5" /><span>{addState.error}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Zdjęcie szczepu</label>
              <ImageUpload current={addPreview} onChange={setAddPreview} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Nazwa <span className="text-red-400">*</span></label>
                <input name="name" type="text" required placeholder="Aurora 22/1" className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Producent <span className="text-red-400">*</span></label>
                <input name="producer" type="text" required placeholder="Aurora Cannabis" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">THC % <span className="text-red-400">*</span></label>
                <input name="thc_pct" type="number" step="0.1" min="0" max="40" required placeholder="22" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">CBD % <span className="text-red-400">*</span></label>
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
              <button type="submit" disabled={addPending}
                className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
                {addPending ? 'Dodaję…' : 'Dodaj szczep'}
              </button>
            </div>
          </form>
        </div>
      )}

      {addState?.success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={15} /> Szczep dodany pomyślnie.
        </div>
      )}
      {deleteError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} /> {deleteError}
        </div>
      )}

      <div className="flex items-center gap-2 pb-1">
        <Leaf size={15} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-700">
          {loading ? 'Ładowanie…' : `${strains.length} szczepów`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-100" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                <div className="h-6 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : strains.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
          <Leaf size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">Brak szczepów</p>
          <p className="text-xs text-slate-400 mt-1">Dodaj pierwszy szczep używając przycisku powyżej.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {strains.map(s => (
            <StrainCard
              key={s.id}
              strain={s}
              onEdit={openEdit}
              onDelete={handleDelete}
              deleting={deleting === s.id}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700">Edytuj szczep</h2>
              <button onClick={() => setEditTarget(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
              {editError && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /><span>{editError}</span>
                </div>
              )}

              <input type="hidden" name="existing_image_url" value={editTarget.image_url ?? ''} />

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Zdjęcie szczepu</label>
                <ImageUpload current={editPreview} onChange={setEditPreview} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Nazwa <span className="text-red-400">*</span></label>
                  <input name="name" type="text" required defaultValue={editTarget.name} className={INPUT} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Producent <span className="text-red-400">*</span></label>
                  <input name="producer" type="text" required defaultValue={editTarget.producer} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">THC % <span className="text-red-400">*</span></label>
                  <input name="thc_pct" type="number" step="0.1" min="0" max="40" required defaultValue={editTarget.thc_pct} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">CBD % <span className="text-red-400">*</span></label>
                  <input name="cbd_pct" type="number" step="0.1" min="0" max="40" required defaultValue={editTarget.cbd_pct} className={INPUT} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Typ</label>
                  <select name="lineage" defaultValue={editTarget.lineage ?? ''} className={INPUT}>
                    <option value="">Wybierz typ…</option>
                    {LINEAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setEditTarget(null)}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                  Anuluj
                </button>
                <button type="submit" disabled={saving}
                  className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
                  {saving ? 'Zapisuję…' : 'Zapisz zmiany'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <button onClick={() => setConfirmTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors min-h-[44px]">
                Anuluj
              </button>
              <button onClick={confirmDelete} disabled={!!deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 min-h-[44px]">
                Usuń szczep
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
