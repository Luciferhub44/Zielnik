'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, ChevronLeft, AlertCircle, CheckCircle2, Phone, Mail, Globe } from 'lucide-react'
import { updatePharmacy } from '@/app/actions/admin'
import type { Tables } from '@/lib/database.types'

const INPUT = [
  'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800',
  'placeholder:text-slate-400 bg-white',
  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60',
  'transition-all duration-150',
].join(' ')

function Field({ label, name, defaultValue, type = 'text', placeholder, required }: {
  label: string; name: string; defaultValue?: string | null
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} placeholder={placeholder} required={required} className={INPUT} />
    </div>
  )
}

export default function EditPharmacyForm({ pharmacy }: { pharmacy: Tables<'pharmacies'> }) {
  const router = useRouter()
  const action = updatePharmacy.bind(null, pharmacy.id)
  const [state, formAction, pending] = useActionState(action, null)

  useEffect(() => {
    if (state?.success) router.push(`/admin/pharmacies/${pharmacy.id}`)
  }, [state])

  return (
    <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto space-y-6">

      <Link href={`/admin/pharmacies/${pharmacy.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
        <ChevronLeft size={15} /> {pharmacy.name}
      </Link>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Edycja</p>
        <h1 className="text-2xl font-black text-slate-800">Edytuj aptekę</h1>
      </div>

      <form action={formAction} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Building2 size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-slate-700">Dane podstawowe</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          {state?.error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="shrink-0 mt-0.5" /> {state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle2 size={15} /> Zapisano. Przekierowuję…
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Nazwa apteki" name="name" defaultValue={pharmacy.name} placeholder="Apteka Medyczna Oliva" required />
            </div>
            <div className="sm:col-span-2">
              <Field label="Adres" name="address" defaultValue={pharmacy.address} placeholder="ul. Grunwaldzka 1" required />
            </div>
            <Field label="Miasto" name="city" defaultValue={pharmacy.city} placeholder="Gdańsk" required />
            <Field label="Województwo" name="voivodeship" defaultValue={pharmacy.voivodeship} placeholder="Pomorskie" required />
            <Field label="Szerokość geogr." name="latitude" type="number" defaultValue={String(pharmacy.latitude ?? '')} placeholder="54.352025" />
            <Field label="Długość geogr."  name="longitude" type="number" defaultValue={String(pharmacy.longitude ?? '')} placeholder="18.646638" />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={13} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Kontakt</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Telefon"    name="phone"   type="tel"  defaultValue={pharmacy.phone}   placeholder="+48 123 456 789" />
              <Field label="E-mail"     name="email"   type="email" defaultValue={pharmacy.email}   placeholder="apteka@example.pl" />
              <Field label="Strona WWW" name="website" type="url"  defaultValue={pharmacy.website} placeholder="https://apteka.pl" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href={`/admin/pharmacies/${pharmacy.id}`}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Anuluj
            </Link>
            <button type="submit" disabled={pending}
              className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px]">
              {pending ? 'Zapisuję…' : 'Zapisz zmiany'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
