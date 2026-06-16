'use client'

import { useEffect, useRef, useState } from 'react'
import { Database, Building2, Factory } from 'lucide-react'

type Stat = { value: number; suffix: string; label: string; icon: React.ElementType }

const STATS: Stat[] = [
  { value: 120, suffix: '+', label: 'preparatów w bazie',      icon: Database   },
  { value: 340, suffix: '+', label: 'aptek w Polsce',          icon: Building2  },
  { value: 5,   suffix: '',  label: 'producentów importerów',  icon: Factory    },
]

function Counter({ value, suffix, label, icon: Icon }: Stat) {
  const [display, setDisplay] = useState(0)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        setActive(true)
        obs.disconnect()

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setDisplay(value)
          return
        }

        const duration = 1400
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3) // cubic ease-out
          setDisplay(Math.round(eased * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div ref={ref} className="px-3 sm:px-8 text-center first:pl-0 last:pr-0 space-y-3">
      <div className={`
        w-10 h-10 rounded-xl mx-auto flex items-center justify-center
        transition-all duration-500
        ${active ? 'bg-white/10 scale-100' : 'bg-white/5 scale-90'}
      `}>
        <Icon size={20} className={`transition-colors duration-500 ${active ? 'text-green-400' : 'text-white/20'}`} />
      </div>

      <div className="space-y-1">
        <p className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">
          {display}{suffix}
        </p>
        <div className="h-0.5 rounded-full bg-white/8 mx-auto max-w-[40px] overflow-hidden">
          <div
            className="h-full bg-green-400/60 rounded-full transition-all duration-700 ease-out"
            style={{ width: active ? '100%' : '0%' }}
          />
        </div>
      </div>

      <p className="text-[11px] sm:text-sm text-white/35 leading-tight">{label}</p>
    </div>
  )
}

export default function StatsCounter() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-3 divide-x divide-white/8">
      {STATS.map((stat) => (
        <Counter key={stat.label} {...stat} />
      ))}
    </div>
  )
}
