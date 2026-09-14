import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-2xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(11,31,68,0.04),0_8px_24px_-12px_rgba(11,31,68,0.10)]',
        className,
      )}
      {...props}
    />
  )
}

export { Card }
