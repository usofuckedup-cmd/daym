'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const navLinks = [
    { label: t.siteHeader.home, href: '/' },
    { label: t.siteHeader.howItWorks, href: '/#how-it-works' },
    { label: t.siteHeader.createDeal, href: '/create-deal' },
    { label: t.siteHeader.myDeals, href: '/dashboard' },
    { label: t.siteHeader.helpCenter, href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                pathname === link.href && 'text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t.siteHeader.login}
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.siteHeader.register}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-muted md:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <LanguageSwitcher className="w-full [&>select]:w-full" />
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground"
              >
                {t.siteHeader.login}
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                {t.siteHeader.register}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
