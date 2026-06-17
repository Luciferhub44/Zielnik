import Link from 'next/link'
import { FileText, Pill, ShieldCheck, ChevronRight, CalendarDays, Clock, PlusCircle, History } from 'lucide-react'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase-server'
import ScrollReveal from '@/app/components/scroll-reveal'
import { daysUntil } from '@/lib/data'

export default async function DashboardPage() {
  const [{ userId }, user] = await Promise.all([auth(), currentUser()])
  const db = createAdminClient()

  const name = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.emailAddresses[0]?.emailAddress
    : 'Pacjent'

  const [{ data: allPrescriptions }, { data: journal }] = await Promise.all([
    db.from('prescriptions').select('*').eq('user_id', userId ?? '').order('valid_until', { ascending: true }),
    db.from('journal_entries').select('*').eq('user_id', userId ?? '').order('entry_date', { ascending: false }).limit(10),
  ])

  const rxAll     = allPrescriptions ?? []
  const rxActive  = rxAll.filter(rx => new Date(rx.valid_until) >= new Date())
  const rxExpired = rxAll.filter(rx => new Date(rx.valid_until) <  new Date())
  const journalList = journal ?? []
  const soonestExpiry = rxActive.length ? daysUntil(rxActive[0].valid_until) : null

  return (
    <div className="min-h-dvh bg-bg-medical pt-14">

      <div className="bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-1">Panel Pacjenta</p>
          <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
          {user?.username && (
            <p className="text-xs text-white/40 mt-0.5">@{user.username}</p>
          )}
          <Link
            href="/patient/wallet"
            className="mt-5 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            <ShieldCheck size={16} />
            Portfel Pacjenta
            <ChevronRight size={14} className="ml-auto opacity-60" />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Aktywne recepty',   value: rxActive.length,    icon: Pill },
              { label: 'Wygasłe recepty',   value: rxExpired.length,   icon: History },
              { label: 'Wpisy w dzienniku', value: journalList.length, icon: CalendarDays },
              { label: 'Wygasa za (dni)',   value: soonestExpiry ?? '—', icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-surface rounded-2xl border border-border-muted p-4 sm:p-5 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-text-main tabular-nums">{value}</p>
                <p className="text-xs text-slate-400 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-main">Aktywne recepty</h2>
              <Link href="/patient/wallet?tab=history" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <PlusCircle size={13} /> Dodaj receptę
              </Link>
            </div>

            {rxActive.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-dashed border-border-muted p-8 text-center space-y-2">
                <Pill size={24} className="text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-500">Brak aktywnych recept</p>
                <p className="text-xs text-slate-400">Dodaj receptę w <Link href="/patient/wallet" className="underline">Portfelu Pacjenta</Link>.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {rxActive.map(rx => {
                  const days = daysUntil(rx.valid_until)
                  return (
                    <li key={rx.id} className="bg-surface rounded-2xl border border-border-muted p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                          <Pill size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <p className="font-semibold text-text-main">{rx.strain_name}</p>
                              {rx.brand && <p className="text-xs text-slate-400">{rx.brand}{rx.dose ? ` · ${rx.dose}` : ''}</p>}
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                              rx.refills_left > 0 ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'
                            }`}>
                              {rx.refills_left > 0 ? `${rx.refills_left} refundacje` : 'Brak refundacji'}
                            </span>
                          </div>
                          <span className={`text-xs flex items-center gap-1 ${days < 30 ? 'text-accent font-medium' : 'text-slate-400'}`}>
                            <Clock size={11} />
                            Ważna do {new Date(rx.valid_until).toLocaleDateString('pl-PL')}
                            {days < 30 && ` · ${days} dni`}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </ScrollReveal>

        {rxExpired.length > 0 && (
          <ScrollReveal>
            <details className="group">
              <summary className="flex items-center gap-2 text-sm font-semibold text-slate-400 cursor-pointer list-none select-none mb-3">
                <History size={16} />
                Historia wygasłych recept ({rxExpired.length})
                <span className="ml-auto transition-transform group-open:rotate-180">▾</span>
              </summary>
              <ul className="space-y-3">
                {rxExpired.map(rx => (
                  <li key={rx.id} className="bg-surface rounded-2xl border border-border-muted p-4 opacity-60">
                    <div className="flex items-center gap-3">
                      <Pill size={16} className="text-slate-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-text-main">{rx.strain_name}</p>
                        <p className="text-xs text-slate-400">
                          Wygasła {new Date(rx.valid_until).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-main">Dziennik terapii</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Faza 2</span>
            </div>

            {journalList.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-dashed border-border-muted p-8 text-center space-y-2">
                <FileText size={24} className="text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-500">Brak wpisów</p>
                <p className="text-xs text-slate-400">Twoje wpisy o samopoczuciu pojawią się tutaj.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {journalList.map(entry => (
                  <li key={entry.id} className="bg-surface rounded-2xl border border-border-muted p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(entry.entry_date).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex gap-1" aria-label={`Ocena: ${entry.rating} z 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full ${i < entry.rating ? 'bg-primary-light' : 'bg-slate-200'}`} aria-hidden />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-text-main leading-relaxed">{entry.note}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="bg-slate-50 rounded-2xl border border-dashed border-border-muted p-5 flex items-center gap-3">
              <PlusCircle size={20} className="text-slate-300 shrink-0" />
              <p className="text-sm text-slate-400">Dodawanie wpisów dostępne w Fazie 2.</p>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </div>
  )
}
