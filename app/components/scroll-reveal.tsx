'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = { children: ReactNode; delay?: number; className?: string }

export default function ScrollReveal({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('reveal', 'reveal-hidden')
    el.style.transitionDelay = `${delay}ms`

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.replace('reveal-hidden', 'reveal-show')
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return <div ref={ref} className={className}>{children}</div>
}
