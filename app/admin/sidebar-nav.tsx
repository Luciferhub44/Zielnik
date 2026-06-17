'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Package, Users, Leaf } from 'lucide-react'

const ADMIN_NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Przegląd'    },
  { href: '/admin/pharmacies', icon: Building2,       label: 'Apteki'      },
  { href: '/admin/strains',    icon: Leaf,            label: 'Szczepy'     },
  { href: '/admin/inventory',  icon: Package,         label: 'Zapasy'      },
  { href: '/admin/users',      icon: Users,           label: 'Użytkownicy' },
]

const PHARMACY_NAV = [
  { href: '/admin',           icon: LayoutDashboard, label: 'Przegląd'    },
  { href: '/admin/inventory', icon: Package,         label: 'Moje zapasy' },
]

function useNav(role: string) {
  return role === 'admin' ? ADMIN_NAV : PHARMACY_NAV
}

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname()
  const items = useNav(role)

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {items.map(({ href, icon: Icon, label }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              active
                ? 'bg-white/12 text-white shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/8'
            }`}
          >
            <Icon size={16} className={active ? 'text-green-400' : ''} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function BottomNav({ role }: { role: string }) {
  const pathname = usePathname()
  const items = useNav(role)

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 flex">
      {items.map(({ href, icon: Icon, label }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
              active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon size={18} />
            <span className="text-[9px] font-semibold">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
