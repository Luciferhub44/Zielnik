import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase-server'
import WalletClient from './wallet-client'

export default async function WalletPage() {
  const { userId } = await auth()
  if (!userId) return null

  const db = createAdminClient()

  const [{ data: doc }, { data: prescriptions }] = await Promise.all([
    db.from('patient_documents').select('*').eq('user_id', userId).maybeSingle(),
    db.from('prescriptions').select('*').eq('user_id', userId).order('valid_until', { ascending: false }),
  ])

  return <WalletClient doc={doc} prescriptions={prescriptions ?? []} />
}
