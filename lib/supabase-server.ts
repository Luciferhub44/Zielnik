import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import type { Database } from './database.types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerClient() {
  const { getToken } = await auth()
  return createClient<Database>(url, anonKey, {
    accessToken: async () => getToken() ?? null,
    auth: { persistSession: false },
  })
}

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
