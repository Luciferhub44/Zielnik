'use client'

import { useActionState } from 'react'
import { Users, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { grantAdminRole } from '@/app/actions/admin'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const INPUT = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white'

export default function UsersPage() {
  const [state, action, pending] = useActionState(grantAdminRole, null)
  const [pharmacies, setPharmacies] = useState<{ id: string; name: string }[]>([])
  const [role, setRole] = useState<'admin' | 'pharmacy_admin'>('pharmacy_admin')

  useEffect(() => {
    supabase.from('pharmacies').select('id, name').order('name').then(({ data }) => setPharmacies(data ?? []))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Użytkownicy & Role</h1>
        <p className="text-sm text-slate-400 mt-0.5">Nadaj dostęp administracyjny użytkownikom platformy</p>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-slate-700">Nadaj rolę</h2>
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <AlertCircle size={15} /> {state.error}
          </div>
        )}
        {state?.success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 size={15} /> Rola nadana pomyślnie.
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Clerk User ID *</label>
          <input name="user_id" type="text" required placeholder="user_2abc..." className={INPUT} />
          <p className="text-xs text-slate-400 mt-1">Znajdź w Clerk Dashboard → Users → kliknij użytkownika</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Rola *</label>
          <select
            name="role"
            value={role}
            onChange={e => setRole(e.target.value as typeof role)}
            className={INPUT}
          >
            <option value="pharmacy_admin">Admin Apteki</option>
            <option value="admin">Admin Platformy</option>
          </select>
        </div>

        {role === 'pharmacy_admin' && (
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">Przypisana apteka</label>
            <select name="pharmacy_id" className={INPUT}>
              <option value="">Wybierz aptekę…</option>
              {pharmacies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">Wymaga SUPABASE_SERVICE_ROLE_KEY</p>
          <button type="submit" disabled={pending}
            className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors min-h-[44px]">
            {pending ? 'Zapisuję…' : 'Nadaj rolę'}
          </button>
        </div>
      </form>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">Ważna informacja</p>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Dane użytkowników (imiona, email, liczba kont) są zarządzane w{' '}
          <strong>Clerk Dashboard → Users</strong>. Supabase przechowuje wyłącznie dane medyczne pacjentów powiązane z Clerk user_id.
        </p>
      </div>
    </div>
  )
}
