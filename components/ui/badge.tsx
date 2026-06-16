import { type HTMLAttributes } from 'react'

export function Badge({ className = '', children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${className}`} {...props}>
      {children}
    </span>
  )
}
