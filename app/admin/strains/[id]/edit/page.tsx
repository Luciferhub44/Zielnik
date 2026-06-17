import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-server'
import EditStrainForm from './edit-form'

export default async function EditStrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()
  const { data: strain } = await db.from('strains').select('*').eq('id', id).single()
  if (!strain) notFound()
  return <EditStrainForm strain={strain} />
}
