import Link from 'next/link'
import { FileText, Pill, ShieldCheck, ChevronRight, CalendarDays, Clock } from 'lucide-react'
import ScrollReveal from '@/app/components/scroll-reveal'

const PATIENT = { name: 'Jan Kowalski', id: 'PAC-2024-00831' }

const PRESCRIPTIONS = [
  {
    id: 'Rx-2024-001',
    strain: 'Aurora 22/1',
    brand: 'Aurora Cannabis',
    dose: '0,5 g · 3× dziennie',
    valid: '2025-12-31',
    refillsLeft: 2,
  },
  {
    id: 'Rx-2024-002',
    strain: 'Spectrum Orange 10/10',
    brand: 'Canopy Growth',
    dose: '0,3 g · 2× dziennie',
    valid: '2025-09-15',
    refillsLeft: 0,
  },
]

const JOURNAL: { date: string; note: string; rating: number }[] = [
  { date: '2025-06-14', note: 'Dobre działanie przeciwbólowe, lepsza jakość snu.', rating: 4 },
  { date: '2025-06-12', note: 'Łagodne działanie. Brak efektów ubocznych.', rating: 5 },
  { date: '2025-06-10', note: 'Zwiększona dawka — skonsultować z lekarzem.', rating: 3 },
]

function RatingDots({ n }: { n: number }) {
  return (
    <div className="flex gap-1" aria-label={`Ocena: ${n} z 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < n ? 'bg-primary-light' : 'bg-slate-200'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const daysToExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-dvh bg-bg-medical pt-14">

      {/* Page header */}
      <div className="bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-1">Panel Pacjenta</p>
          <h1 className="text-2xl sm:text-3xl font-bold">{PATIENT.name}</h1>
          <p className="text-sm text-white/60 mt-0.5">ID: {PATIENT.id}</p>

          {/* Police Mode quick access */}
          <Link
            href="/patient/wallet"
            className="mt-5 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            <ShieldCheck size={16} />
            Otwórz Tryb Policyjny
            <ChevronRight size={14} className="ml-auto opacity-60" />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Summary cards */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'Aktywne recepty', value: PRESCRIPTIONS.length, icon: FileText },
              { label: 'Wpisy w dzienniku', value: JOURNAL.length, icon: CalendarDays },
              { label: 'Wygasa za (dni)', value: daysToExpiry(PRESCRIPTIONS[0].valid), icon: Clock },
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

        {/* Prescriptions */}
        <ScrollReveal delay={60}>
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-text-main">Aktywne recepty</h2>
            <ul className="space-y-3">
              {PRESCRIPTIONS.map((rx) => {
                const days = daysToExpiry(rx.valid)
                const expirySoon = days < 30
                return (
                  <li key={rx.id} className="bg-surface rounded-2xl border border-border-muted p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                        <Pill size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-semibold text-text-main">{rx.strain}</p>
                            <p className="text-xs text-slate-400">{rx.brand} · {rx.dose}</p>
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                            rx.refillsLeft > 0
                              ? 'bg-status-success/10 text-status-success'
                              : 'bg-status-error/10 text-status-error'
                          }`}>
                            {rx.refillsLeft > 0 ? `${rx.refillsLeft} refundacje` : 'Brak refundacji'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <span className={`text-xs flex items-center gap-1 ${expirySoon ? 'text-accent font-medium' : 'text-slate-400'}`}>
                            <Clock size={11} />
                            Ważna do {new Date(rx.valid).toLocaleDateString('pl-PL')}
                            {expirySoon && ` · ${days} dni`}
                          </span>
                          <span className="text-xs text-slate-300">{rx.id}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        </ScrollReveal>

        {/* Journal */}
        <ScrollReveal delay={120}>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-main">Dziennik terapii</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Faza 1 — tylko odczyt</span>
            </div>
            <ul className="space-y-3">
              {JOURNAL.map((entry) => (
                <li key={entry.date} className="bg-surface rounded-2xl border border-border-muted p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(entry.date).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <RatingDots n={entry.rating} />
                  </div>
                  <p className="text-sm text-text-main leading-relaxed">{entry.note}</p>
                </li>
              ))}
            </ul>

            <div className="bg-slate-50 rounded-2xl border border-dashed border-border-muted p-6 text-center space-y-2">
              <FileText size={24} className="text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-500">Dodawanie wpisów dostępne w Fazie 2</p>
              <p className="text-xs text-slate-400">Integracja z bazą danych Supabase — już wkrótce.</p>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </div>
  )
}
