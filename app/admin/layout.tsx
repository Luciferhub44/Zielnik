import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Leaf, ArrowLeft, AlertTriangle } from 'lucide-react'
import SidebarNav, { BottomNav } from './sidebar-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined
  if (!role || !['admin', 'pharmacy_admin'].includes(role)) redirect('/')

  const isAppAdmin = role === 'admin'
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  return (
    <div className="min-h-dvh bg-[#F8FAF9] flex">

      <aside className="hidden sm:flex flex-col fixed inset-y-0 left-0 w-56 bg-[#0b1f13] z-40 shadow-xl">
        <div className="px-5 pt-6 pb-5 border-b border-white/8 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Leaf size={15} className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Zielnik</p>
              <p className="text-green-400/60 text-[10px] font-semibold tracking-widest uppercase mt-0.5">
                {isAppAdmin ? 'App Admin' : 'Apteka'}
              </p>
            </div>
          </Link>
        </div>

        <SidebarNav role={role} />

        <div className="px-4 py-4 border-t border-white/8 shrink-0 space-y-2">
          <p className="text-[11px] text-white/25 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={12} />
            Wróć do aplikacji
          </Link>
        </div>
      </aside>

      <header className="sm:hidden fixed top-0 inset-x-0 z-50 bg-[#0b1f13] h-14 flex items-center justify-between px-4 shadow-lg shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
            <Leaf size={13} className="text-green-400" />
          </div>
          <span className="text-white font-bold text-sm">Zielnik Admin</span>
        </Link>
        <Link href="/" className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={13} />
          App
        </Link>
      </header>

      <div className="flex-1 sm:pl-56 flex flex-col min-h-dvh">
        {!hasServiceKey && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex items-center gap-2.5 shrink-0">
            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 leading-snug">
              <strong>Tryb tylko do odczytu.</strong>{' '}
              Dodaj{' '}
              <code className="font-mono bg-amber-100 px-1 rounded text-amber-900">SUPABASE_SERVICE_ROLE_KEY</code>{' '}
              do <code className="font-mono bg-amber-100 px-1 rounded text-amber-900">.env.local</code>{' '}
              aby odblokować dodawanie i edycję danych.
            </p>
          </div>
        )}

        <main className="flex-1 pt-14 sm:pt-0 pb-20 sm:pb-0">
          {children}
        </main>
      </div>

      <BottomNav role={role} />
    </div>
  )
}
