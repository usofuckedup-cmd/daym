import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3.5 py-2 text-base text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground',
        'focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15',
        'disabled:pointer-events-none disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
