import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import type { Database } from './database.types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-only client that injects the Clerk JWT so Supabase RLS sees auth.uid() = Clerk user ID.
// Requires a "supabase" JWT template in the Clerk dashboard:
//   Dashboard → Configure → JWT Templates → New → Supabase preset
export async function createServerClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: 'supabase' }).catch(() => null)

  return createClient<Database>(url, anonKey, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    auth: { persistSession: false },
  })
}
