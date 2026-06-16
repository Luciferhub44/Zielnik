'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, ShieldCheck, Menu, X, LayoutDashboard } from 'lucide-react'
import { SignInButton, Show, UserButton, useUser } from '@clerk/nextjs'

const PUBLIC_LINKS  = [{ href: '/search',            label: 'Szukaj preparatów' }]
const PATIENT_LINKS = [{ href: '/patient/dashboard', label: 'Panel Pacjenta'    }]

export default function Nav() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const role = user?.publicMetadata?.role as string | undefined
  const isAdmin = role === 'admin' || role === 'pharmacy_admin'

  const LINKS = [
    ...PUBLIC_LINKS,
    ...(isSignedIn ? PATIENT_LINKS : []),
  ]

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Admin has its own sidebar layout — skip global nav (after hooks)
  if (pathname.startsWith('/admin')) return null

  const glass = scrolled || !isHome

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        glass ? 'bg-surface/90 backdrop-blur-md border-b border-border-muted shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          <Link href="/" className={`flex items-center gap-2 font-semibold text-sm transition-colors duration-200 ${
            glass ? 'text-primary' : 'text-white'
          }`}>
            <Leaf size={18} />
            Zielnik
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === href
                    ? 'bg-primary/10 text-primary'
                    : glass
                    ? 'text-slate-600 hover:text-primary hover:bg-primary/5'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}>
                {label}
              </Link>
            ))}

            {isAdmin && (
              <Link href="/admin"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                  pathname.startsWith('/admin')
                    ? 'bg-primary/10 text-primary'
                    : glass
                    ? 'text-slate-600 hover:text-primary hover:bg-primary/5'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}>
                <LayoutDashboard size={13} />
                Admin
              </Link>
            )}

            <Link href="/patient/wallet"
              className="ml-2 flex items-center gap-1.5 bg-primary text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors duration-150">
              <ShieldCheck size={14} />
              Tryb Policyjny
            </Link>

            <div className="ml-2 flex items-center">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    glass ? 'text-slate-600 hover:text-primary hover:bg-primary/5' : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}>
                    Zaloguj
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </nav>

          {/* Mobile burger */}
          <button onClick={() => setOpen(true)} aria-label="Otwórz menu" aria-expanded={open}
            className={`sm:hidden p-2 -mr-1.5 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
              glass ? 'text-text-main hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div onClick={() => setOpen(false)} aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} />

      {/* Mobile drawer */}
      <div role="dialog" aria-modal="true" aria-label="Menu nawigacji"
        className={`fixed top-0 right-0 h-full w-[280px] bg-surface z-50 sm:hidden shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-border-muted shrink-0">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm text-primary">
            <Leaf size={18} />
            Zielnik
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Zamknij menu"
            className="p-2 -mr-1.5 rounded-lg text-slate-400 hover:text-text-main hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                pathname === href ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`}>
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin"
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                pathname.startsWith('/admin') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`}>
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
        </nav>

        <div className="px-4 pb-8 pt-4 border-t border-border-muted shrink-0 space-y-3">
          <Link href="/patient/wallet"
            className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors min-h-[44px]">
            <ShieldCheck size={16} />
            Tryb Policyjny
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="flex items-center justify-center w-full border border-border-muted text-slate-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors min-h-[44px]">
                Zaloguj się
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-3 px-1">
              <UserButton />
              <span className="text-sm text-slate-500">Twoje konto</span>
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}
