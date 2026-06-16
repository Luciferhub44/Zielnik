import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

// InventoryRow is what Supabase returns from the joined query
export type InventoryRow = {
  id: string
  stock_level: number
  price_per_gram: number
  expiry_date: string
  strains: {
    id: string
    name: string
    producer: string
    thc_pct: number
    cbd_pct: number
    lineage: string
  }
  pharmacies: {
    name: string
    city: string
    voivodeship: string
    address: string
  }
}
