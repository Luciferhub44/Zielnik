import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Leaf, LayoutDashboard, Building2, Package, Users, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined

  if (!role || !['admin', 'pharmacy_admin'].includes(role)) redirect('/')

  const isAppAdmin = role === 'admin'

  const NAV = isAppAdmin
    ? [
        { href: '/admin',             icon: LayoutDashboard, label: 'Przegląd'     },
        { href: '/admin/pharmacies',  icon: Building2,       label: 'Apteki'       },
        { href: '/admin/inventory',   icon: Package,         label: 'Zapasy'       },
        { href: '/admin/users',       icon: Users,           label: 'Użytkownicy'  },
      ]
    : [
        { href: '/admin',            icon: LayoutDashboard, label: 'Przegląd'     },
        { href: '/admin/inventory',  icon: Package,         label: 'Moje zapasy'  },
      ]

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Admin top bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-primary shadow-lg h-14 flex items-center gap-3 px-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2 shrink-0">
          <Leaf size={18} className="text-green-300" />
          <span className="font-bold text-white text-sm">Zielnik</span>
          <span className="hidden sm:block text-[10px] font-semibold bg-green-500/30 text-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {isAppAdmin ? 'Admin' : 'Apteka'}
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-0.5 ml-2">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          <span className="hidden sm:block text-xs text-white/40 truncate max-w-[160px]">
            {user?.emailAddresses[0]?.emailAddress}
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:block">Aplikacja</span>
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-primary border-t border-white/10 flex">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-0.5 py-3 text-white/60 hover:text-white transition-colors"
          >
            <Icon size={18} />
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <main className="pt-14 pb-20 sm:pb-0">{children}</main>
    </div>
  )
}
