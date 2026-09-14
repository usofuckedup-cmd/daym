import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground',
        emerald: 'bg-emerald/10 text-emerald',
        navy: 'bg-primary text-primary-foreground',
        outline: 'border border-border bg-background text-muted-foreground',
        warning: 'bg-amber-100 text-amber-700',
        destructive: 'bg-destructive/10 text-destructive',
        blue: 'bg-blue-100 text-blue-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
