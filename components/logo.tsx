import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '/',
  variant = 'default',
}: {
  className?: string
  href?: string
  variant?: 'default' | 'light'
}) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-emerald text-emerald-foreground">
        <ShieldCheck className="size-5" />
      </span>
      <span
        className={cn(
          'text-lg font-semibold tracking-tight',
          variant === 'light' ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        SafeDeal
      </span>
    </Link>
  )
}
