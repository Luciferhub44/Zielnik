import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-server'
import EditPharmacyForm from './edit-form'

export default async function EditPharmacyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()
  const { data: pharmacy } = await db.from('pharmacies').select('*').eq('id', id).maybeSingle()
  if (!pharmacy) notFound()
  return <EditPharmacyForm pharmacy={pharmacy} />
}
