'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ImageIcon } from 'lucide-react'
import { updateStrain } from '@/app/actions/admin'
import { INPUT } from '@/app/admin/styles'
import type { Tables } from '@/lib/database.types'

const LINEAGE_OPTIONS = ['Sativa', 'Indica', 'Hybrid', 'Sativa-dominant', 'Indica-dominant']

export default function EditStrainForm({ strain }: { strain: Tables<'strains'> }) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(strain.image_url ?? null)
  const [error, setError]     = useState('')
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [, startSave] = useTransition()

  function handleFile(file: File | undefined) {
    if (!file) return
    if (inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
    }
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setSaving(true)
    setError('')
    startSave(async () => {
      const res = await updateStrain(strain.id, null, formData)
      setSaving(false)
      if (res?.error) setError(res.error)
      else router.push(`/admin/strains/${strain.id}`)
    })
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto space-y-6">

      <Link href={`/admin/strains/${strain.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
        <ChevronLeft size={15} /> {strain.name}
      </Link>

      <h1 className="text-2xl font-black text-slate-800">Edytuj szczep</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
          )}

          <input type="hidden" name="existing_image_url" value={strain.image_url ?? ''} />

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Zdjęcie szczepu</label>
            <div
              className={`relative flex flex-col items-center justify-center gap-2 w-full h-52 border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                dragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50'
              }`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Podgląd" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              ) : (
                <>
                  <ImageIcon size={24} className="text-slate-300 pointer-events-none" />
                  <span className="text-xs text-slate-400 pointer-events-none">Kliknij lub przeciągnij zdjęcie</span>
                  <span className="text-[11px] text-slate-300 pointer-events-none">JPG, PNG, WEBP · max 5 MB</span>
                </>
              )}
              <input
                ref={inputRef}
                name="image"
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={e => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Nazwa <span className="text-red-400">*</span></label>
              <input name="name" type="text" required defaultValue={strain.name} className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Producent <span className="text-red-400">*</span></label>
              <input name="producer" type="text" required defaultValue={strain.producer} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">THC % <span className="text-red-400">*</span></label>
              <input name="thc_pct" type="number" step="0.1" min="0" max="40" required defaultValue={strain.thc_pct} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">CBD % <span className="text-red-400">*</span></label>
              <input name="cbd_pct" type="number" step="0.1" min="0" max="40" required defaultValue={strain.cbd_pct} className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Typ</label>
              <select name="lineage" defaultValue={strain.lineage ?? ''} className={INPUT}>
                <option value="">Wybierz typ…</option>
                {LINEAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href={`/admin/strains/${strain.id}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Anuluj
            </Link>
            <button type="submit" disabled={saving}
              className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
              {saving ? 'Zapisuję…' : 'Zapisz zmiany'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
