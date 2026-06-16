'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-server'
import type { ActionState } from './types'

export async function upsertDocument(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { userId } = await auth()
  if (!userId) return { error: 'Brak autoryzacji' }
  const db = createAdminClient()
  const { error } = await db.from('patient_documents').upsert(
    {
      user_id: userId,
      prescription_code: String(formData.get('prescription_code')).trim(),
      patient_pesel: String(formData.get('patient_pesel')).trim(),
    },
    { onConflict: 'user_id' }
  )
  if (error) return { error: error.message }
  revalidatePath('/patient/wallet')
  return { success: true }
}

export async function addPrescription(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { userId } = await auth()
  if (!userId) return { error: 'Brak autoryzacji' }
  const db = createAdminClient()
  const { error } = await db.from('prescriptions').insert({
    user_id: userId,
    strain_name: String(formData.get('strain_name')).trim(),
    brand: String(formData.get('brand') || '').trim(),
    dose: String(formData.get('dose') || '').trim(),
    valid_until: String(formData.get('valid_until')),
    refills_left: Number(formData.get('refills_left') ?? 0),
  })
  if (error) return { error: error.message }
  revalidatePath('/patient/wallet')
  revalidatePath('/patient/dashboard')
  return { success: true }
}

export async function deletePrescription(id: string): Promise<ActionState> {
  const { userId } = await auth()
  if (!userId) return { error: 'Brak autoryzacji' }
  const db = createAdminClient()
  const { error } = await db.from('prescriptions').delete().eq('id', id).eq('user_id', userId)
  if (error) return { error: error.message }
  revalidatePath('/patient/wallet')
  revalidatePath('/patient/dashboard')
  return { success: true }
}
