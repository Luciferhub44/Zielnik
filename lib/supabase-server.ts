import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import type { Database } from './database.types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Requires "supabase" JWT template in Clerk Dashboard → Configure → JWT Templates → New → Supabase preset
export async function createServerClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: 'supabase' }).catch(() => null)
  return createClient<Database>(url, anonKey, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    auth: { persistSession: false },
  })
}

// Bypasses RLS for admin operations — requires SUPABASE_SERVICE_ROLE_KEY in env
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set — add it from Supabase Dashboard → Settings → API')
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
