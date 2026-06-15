import Link from 'next/link'
import { Leaf, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-bg-medical flex items-center justify-center px-4 pt-14">
      <div className="text-center space-y-6 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Leaf size={32} className="text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">404</p>
          <h1 className="text-2xl font-bold text-text-main">Nie znaleziono strony</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ta strona nie istnieje lub została przeniesiona.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors min-h-[44px]"
          >
            Strona główna
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 border border-border-muted text-text-main px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white transition-colors min-h-[44px]"
          >
            <Search size={15} />
            Szukaj preparatów
          </Link>
        </div>
      </div>
    </div>
  )
}
