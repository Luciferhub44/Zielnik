'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShieldCheck, ChevronDown } from 'lucide-react'

export default function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.42}px)`
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section className="relative h-[92dvh] overflow-hidden flex items-center" aria-label="Hero">
      {/* Parallax background — Higgsfield Seedream V5 Lite generated */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform scale-110" aria-hidden="true">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Darkening gradient over photo so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020d07]/85 via-[#1B4332]/70 to-[#2D6A4F]/50" />
        {/* Ambient color orbs for depth */}
        <div className="absolute top-1/4 right-1/3 w-[480px] h-[480px] rounded-full bg-primary-light/10 blur-[90px]" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-status-success/8 blur-[60px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Botanical SVG — right side decoration, lg+ only */}
      <div
        className="absolute right-0 bottom-0 top-0 w-1/2 hidden lg:flex items-end justify-end pointer-events-none z-[1]"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/botanical.svg"
          alt=""
          className="h-[88%] w-auto opacity-20 select-none"
          style={{ filter: 'drop-shadow(0 0 48px rgba(64,145,108,0.35))' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-2xl space-y-7">
          <div className="animate-hero-badge inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-xs text-white/80 font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            Platforma dla pacjentów medycznych · Polska
          </div>

          <h1 className="animate-hero-h1 text-[2.4rem] sm:text-5xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
            Konopie Medyczne.<br />
            <span className="text-primary-light">Łatwo. Legalnie.</span>
          </h1>

          <p className="animate-hero-p text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl">
            Sprawdzaj dostępność preparatów konopnych w aptekach na terenie całej
            Polski i miej dokumenty prawne zawsze pod ręką.
          </p>

          <div className="animate-hero-cta flex flex-wrap gap-3 pt-1">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-light hover:text-white transition-colors duration-200"
            >
              <Search size={16} />
              Szukaj preparatów
            </Link>
            <Link
              href="/patient/wallet"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors duration-200"
            >
              <ShieldCheck size={16} />
              Tryb Policyjny
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#features"
        aria-label="Przewiń w dół"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors z-10"
      >
        <ChevronDown size={26} />
      </a>
    </section>
  )
}
