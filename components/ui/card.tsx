import { type HTMLAttributes, forwardRef } from 'react'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`rounded-2xl border border-border-muted bg-surface shadow-sm ${className}`} {...props} />
  )
)
Card.displayName = 'Card'
