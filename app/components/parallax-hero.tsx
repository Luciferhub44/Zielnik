'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowDown } from 'lucide-react'

export default function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.38}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <section className="relative h-[100dvh] overflow-hidden flex items-center" aria-label="Hero">
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform scale-110" aria-hidden="true">
        <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020d07]/70 via-[#020d07]/50 to-[#020d07]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020d07]/60 via-transparent to-transparent" />
      </div>

      {/* Botanical SVG — right side, large screens */}
      <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden lg:flex items-end justify-end pointer-events-none z-[1]" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/botanical.svg" alt="" className="h-[85%] w-auto opacity-10 select-none" style={{ filter: 'drop-shadow(0 0 64px rgba(64,145,108,0.2))' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 w-full">
        <div className="max-w-3xl space-y-8">

          <div className="animate-hero-h1 space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-green-400/80">
              Platforma medyczna · Polska
            </p>
            <h1 className="text-[3.2rem] sm:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.04] tracking-tight">
              Konopie<br />
              <span className="text-primary-light">Medyczne.</span>
            </h1>
          </div>

          <p className="animate-hero-p text-lg sm:text-xl text-white/60 leading-relaxed max-w-lg font-light">
            Sprawdzaj dostępność preparatów w aptekach na terenie całej Polski.
            Miej dokumenty prawne zawsze pod ręką.
          </p>

          <div className="animate-hero-cta flex items-center gap-4">
            <Link
              href="/search"
              className="group inline-flex items-center gap-2.5 bg-white text-primary px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary-light hover:text-white transition-all duration-200 shadow-lg shadow-black/20"
            >
              <Search size={15} />
              Szukaj preparatów
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20"
            >
              Załóż konto →
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/20">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  )
}
