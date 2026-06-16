import Link from 'next/link'
import Image from 'next/image'
import { Search, ShieldCheck, BookOpen, CheckCircle, MapPin, FileText, ArrowRight } from 'lucide-react'
import ParallaxHero from './components/parallax-hero'
import ScrollReveal from './components/scroll-reveal'
import StatsCounter from './components/stats-counter'

const FEATURES = [
  {
    icon: Search,
    title: 'Wyszukaj preparat',
    desc: 'Filtruj po nazwie, marce, stosunku THC/CBD lub typie odmiany. Wyniki z aptek w czasie rzeczywistym.',
    href: '/search',
  },
  {
    icon: ShieldCheck,
    title: 'Portfel Pacjenta',
    desc: 'Błyskawiczny dostęp do kodu e-recepty, PESEL i podstawy prawnej podczas kontroli.',
    href: '/patient/wallet',
  },
  {
    icon: BookOpen,
    title: 'Dziennik Pacjenta',
    desc: 'Śledź recepty i historię terapii. Wszystko zaszyfrowane i dostępne tylko dla Ciebie.',
    href: '/patient/dashboard',
  },
]

const STEPS = [
  {
    n: '01',
    icon: CheckCircle,
    title: 'Zarejestruj się',
    desc: 'Bezpieczne konto chronione uwierzytelnianiem dwuskładnikowym. Twoje dane medyczne są zaszyfrowane.',
  },
  {
    n: '02',
    icon: MapPin,
    title: 'Znajdź preparat',
    desc: 'Wyszukaj po nazwie, producencie lub ratiu THC/CBD. Sprawdź ceny i dostępność w aptekach.',
  },
  {
    n: '03',
    icon: FileText,
    title: 'Miej dokumenty przy sobie',
    desc: 'Kod e-recepty i dane pacjenta zawsze dostępne — natychmiastowy skan apteczny.',
  },
]

export default function Home() {
  return (
    <>
      <ParallaxHero />

      <div className="bg-[#0b1f13] border-y border-white/5">
        <StatsCounter />
      </div>

      <section id="features" className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <ScrollReveal>
          <div className="mb-16 space-y-4 max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-primary-light">Funkcjonalności</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-text-main leading-[1.1] tracking-tight">
              Wszystko, czego<br />potrzebujesz
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Platforma zaprojektowana z myślą o pacjentach medycznych w Polsce.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, href }, i) => (
            <ScrollReveal key={title} delay={i * 80}>
              <Link href={href} className="group block h-full">
                <div className="h-full bg-white rounded-2xl border border-slate-100 p-8 space-y-5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-text-main text-lg">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Dowiedz się więcej <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#F0F4F1] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="space-y-6">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-primary-light">Jakość i precyzja</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-text-main leading-[1.1] tracking-tight">
                  Preparat pod<br />lupą
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                  Każdy preparat opisany szczegółowo — odmiana, stosunek THC/CBD, producent,
                  cena za gram i aktualna dostępność w aptekach w Twojej okolicy.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-light transition-colors duration-200"
                >
                  <Search size={15} />
                  Przeglądaj preparaty
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="relative">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
                  <Image
                    src="/strain-macro.png"
                    alt="Preparat konopny z bliska"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl shadow-black/8 px-5 py-4 border border-slate-100">
                  <p className="text-2xl font-black text-text-main tabular-nums">120+</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">preparatów w bazie</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-[#081C15] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
          <Image src="/pharmacy-interior.png" alt="" fill sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#081C15]/50 to-[#081C15]" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <ScrollReveal>
            <div className="mb-16 space-y-4 max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-green-400/70">Jak to działa</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                Trzy proste<br />kroki
              </h2>
              <p className="text-white/40 text-lg">Od rejestracji do znalezienia preparatu — wszystko w kilka minut.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <ScrollReveal key={n} delay={i * 100}>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-white/[0.06] leading-none tabular-nums select-none">{n}</span>
                    <div className="w-11 h-11 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-green-400" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-lg">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1f13] via-primary to-[#2D6A4F]">
            <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/botanical.svg" alt="" className="absolute right-0 bottom-0 h-full w-auto" />
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-light/20 blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" aria-hidden="true" />

            <div className="relative px-10 sm:px-16 py-16 sm:py-20">
              <div className="max-w-xl space-y-6">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-green-400/70">Dołącz do platformy</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                  Zacznij<br />korzystać<br />z Zielnik
                </h2>
                <p className="text-white/50 text-lg leading-relaxed max-w-sm">
                  Bezpłatna platforma dla pacjentów medycznych w Polsce.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary-light hover:text-white transition-colors duration-200 shadow-lg shadow-black/20"
                  >
                    Załóż konto — bezpłatnie
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors duration-200"
                  >
                    <Search size={14} />
                    Szukaj preparatów
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-border-muted">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-main">Zielnik</p>
            <p className="text-xs text-slate-400">© 2026 Platforma informacyjna dla pacjentów medycznych.</p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs text-right">
            Informacje mają charakter wyłącznie informacyjny.<br />Nie są poradą medyczną.
          </p>
        </div>
      </footer>
    </>
  )
}
