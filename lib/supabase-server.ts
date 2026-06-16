import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import type { Database } from './database.types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Uses Clerk's native session token (RS256) — works once Supabase Third-Party Auth is configured.
// Until then, falls back to anon (no RLS). Patient pages use createAdminClient() instead.
export async function createServerClient() {
  const { getToken } = await auth()
  return createClient<Database>(url, anonKey, {
    accessToken: async () => getToken() ?? null,
    auth: { persistSession: false },
  })
}

// Bypasses RLS via service role — server-side only, never expose to client.
// Auth enforcement is done in the calling code via Clerk's auth().
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
