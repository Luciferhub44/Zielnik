import { createServerClient } from '@/lib/supabase-server'
import WalletClient from './wallet-client'

export default async function WalletPage() {
  const db = await createServerClient()

  const [{ data: doc }, { data: prescriptions }] = await Promise.all([
    db.from('patient_documents').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
    db.from('prescriptions').select('*').order('valid_until', { ascending: false }),
  ])

  return <WalletClient doc={doc} prescriptions={prescriptions ?? []} />
}
