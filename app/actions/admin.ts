'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-server'

type ActionState = { success?: boolean; error?: string } | null

async function requireAdmin() {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined
  if (!['admin', 'pharmacy_admin'].includes(role ?? '')) throw new Error('Brak uprawnień')
  return { user, role: role! }
}

export async function addPharmacy(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const name = String(formData.get('name')).trim()
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { error } = await db.from('pharmacies').insert({
      name,
      slug,
      address: String(formData.get('address')).trim(),
      city: String(formData.get('city')).trim(),
      voivodeship: String(formData.get('voivodeship')).trim(),
      latitude: Number(formData.get('latitude') || 0),
      longitude: Number(formData.get('longitude') || 0),
    })
    if (error) return { error: error.message }
    revalidatePath('/admin/pharmacies')
    revalidatePath('/admin')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function updateInventoryStock(id: string, stockLevel: number): Promise<ActionState> {
  try {
    const { role, user } = await requireAdmin()
    const db = createAdminClient()
    let query = db.from('inventory').update({ stock_level: stockLevel, updated_at: new Date().toISOString() }).eq('id', id)
    // pharmacy_admin can only touch their own pharmacy's inventory
    if (role === 'pharmacy_admin') {
      const pharmacyId = user?.publicMetadata?.pharmacy_id as string | undefined
      if (pharmacyId) query = db.from('inventory').update({ stock_level: stockLevel, updated_at: new Date().toISOString() }).eq('id', id).eq('pharmacy_id', pharmacyId)
    }
    const { error } = await query
    if (error) return { error: error.message }
    revalidatePath('/admin/inventory')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function addInventoryItem(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { error } = await db.from('inventory').insert({
      pharmacy_id: String(formData.get('pharmacy_id')),
      strain_id: String(formData.get('strain_id')),
      price_per_gram: Number(formData.get('price_per_gram')),
      stock_level: Number(formData.get('stock_level') || 0),
      expiry_date: String(formData.get('expiry_date')),
      batch_number: String(formData.get('batch_number') || '').trim() || null,
    })
    if (error) return { error: error.message }
    revalidatePath('/admin/inventory')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function grantAdminRole(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { role } = await requireAdmin()
    if (role !== 'admin') return { error: 'Tylko główny admin może nadawać role' }
    const db = createAdminClient()
    const { error } = await db.from('admin_users').upsert({
      user_id: String(formData.get('user_id')).trim(),
      role: String(formData.get('role')) as 'admin' | 'pharmacy_admin',
      pharmacy_id: String(formData.get('pharmacy_id') || '') || null,
    })
    if (error) return { error: error.message }
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}
