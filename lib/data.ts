import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export type FilterType = 'all' | 'Sativa' | 'Indica' | 'Hybrid' | 'high-thc' | 'balanced'

export type Strain = {
  id: string
  name: string
  brand: string
  type: 'Sativa' | 'Indica' | 'Hybrid'
  thc: number
  cbd: number
  pharmacy: string
  city: string
  voivodeship: string
  address: string
  pricePerGram: number
  expiryDate: string
  inStock: boolean
}

export function filterStrains(strains: Strain[], query: string, filter: FilterType): Strain[] {
  const q = query.toLowerCase()
  return strains.filter((s) => {
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.brand.toLowerCase().includes(q) ||
      `${s.thc}/${s.cbd}`.includes(q)

    const matchesFilter =
      filter === 'all' ||
      (filter === 'high-thc' && s.thc >= 20) ||
      (filter === 'balanced' && Math.abs(s.thc - s.cbd) <= 2) ||
      s.type === filter

    return matchesQuery && matchesFilter
  })
}

export function isNearExpiry(dateStr: string): boolean {
  const diff = new Date(dateStr).getTime() - Date.now()
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000
}

export function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}

const LINEAGE: Record<string, Strain['type']> = {
  'Sativa-dominant': 'Sativa',
  'Indica-dominant': 'Indica',
}

export async function fetchStrains(client: SupabaseClient<Database>): Promise<Strain[]> {
  const { data, error } = await client
    .from('inventory')
    .select(`
      id,
      stock_level,
      price_per_gram,
      expiry_date,
      strains ( id, name, producer, thc_pct, cbd_pct, lineage ),
      pharmacies ( name, city, voivodeship, address )
    `)
    .order('updated_at', { ascending: false })

  if (error || !data?.length) return []

  return data.map((row: any) => ({
    id: row.id,
    name: row.strains.name,
    brand: row.strains.producer,
    type: LINEAGE[row.strains.lineage] ?? 'Hybrid',
    thc: row.strains.thc_pct,
    cbd: row.strains.cbd_pct,
    pharmacy: row.pharmacies.name,
    city: row.pharmacies.city,
    voivodeship: row.pharmacies.voivodeship,
    address: row.pharmacies.address,
    pricePerGram: row.price_per_gram,
    expiryDate: row.expiry_date,
    inStock: row.stock_level > 0,
  }))
}
