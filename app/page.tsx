import Link from 'next/link'
import Image from 'next/image'
import { Search, ShieldCheck, BookOpen, CheckCircle, MapPin, FileText } from 'lucide-react'
import ParallaxHero from './components/parallax-hero'
import ScrollReveal from './components/scroll-reveal'
import StatsCounter from './components/stats-counter'

const FEATURES = [
  {
    icon: Search,
    title: 'Wyszukaj preparat',
    desc: 'Filtruj po nazwie, marce, stosunku THC/CBD lub typie odmiany. Wyniki w czasie rzeczywistym.',
  },
  {
    icon: ShieldCheck,
    title: 'Tryb Policyjny',
    desc: 'Błyskawiczny dostęp do dokumentów prawnych podczas kontroli drogowej. Zero scrolla.',
  },
  {
    icon: BookOpen,
    title: 'Dziennik Pacjenta',
    desc: 'Śledź swoje recepty i historię terapii. Wszystko w jednym miejscu.',
  },
]

const STEPS = [
  {
    n: '01',
    icon: CheckCircle,
    title: 'Zarejestruj się jako pacjent',
    desc: 'Bezpieczne konto chronione uwierzytelnianiem dwuskładnikowym (Clerk). Twoje dane medyczne są zaszyfrowane.',
  },
  {
    n: '02',
    icon: MapPin,
    title: 'Znajdź preparat w swojej okolicy',
    desc: 'Wyszukaj po nazwie, producencie lub ratiu THC/CBD. Sprawdź ceny i dostępność w aptekach.',
  },
  {
    n: '03',
    icon: FileText,
    title: 'Miej dokumenty zawsze przy sobie',
    desc: 'Tryb Policyjny wyświetla kod e-recepty, dane pacjenta i podstawę prawną natychmiast.',
  },
]

export default function Home() {
  return (
    <>
      <ParallaxHero />

      <StatsCounter />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <ScrollReveal>
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">Funkcjonalności</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main">Wszystko, czego potrzebujesz</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Platforma zaprojektowana z myślą o pacjentach medycznych w Polsce.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 80}>
              <div className="card-lift bg-surface rounded-2xl border border-border-muted p-7 h-full space-y-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-main text-lg">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface border-y border-border-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
              {/* Strain macro image */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="/strain-macro.png"
                    alt="Preparat konopny z bliska"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">Konopie Medyczne</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-center lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">Jak to działa</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-main">Trzy proste kroki</h2>
                <p className="text-slate-500 max-w-md">Od rejestracji do znalezienia preparatu — wszystko w kilka minut.</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-10">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <ScrollReveal key={n} delay={i * 100}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-primary/10 leading-none tabular-nums">{n}</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-text-main">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#1B4332] to-[#2D6A4F] p-10 sm:p-16 text-center space-y-6">
            {/* Decorative orb */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-light/20 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" aria-hidden="true" />

            <div className="relative space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Zacznij korzystać z Zielnik
              </h2>
              <p className="text-white/65 max-w-md mx-auto">
                Bezpłatna platforma dla pacjentów medycznych w Polsce.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Link
                  href="/search"
                  className="bg-white text-primary px-7 py-3 rounded-xl font-semibold text-sm hover:bg-primary-light hover:text-white transition-colors duration-200"
                >
                  Szukaj preparatów
                </Link>
                <Link
                  href="/patient/wallet"
                  className="bg-white/10 border border-white/20 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors duration-200"
                >
                  Tryb Policyjny
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Zielnik. Platforma informacyjna dla pacjentów medycznych.</p>
          <p>Informacje mają charakter wyłącznie informacyjny. Nie są poradą medyczną.</p>
        </div>
      </footer>
    </>
  )
}
