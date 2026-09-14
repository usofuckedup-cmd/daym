import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-base text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground',
        'focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15',
        'disabled:pointer-events-none disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
