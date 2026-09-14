'use client'

import Link from 'next/link'
import { ShieldCheck, Lock, Check } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  const { t } = useLanguage()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Logo variant="light" />
        <div>
          <ShieldCheck className="size-10 text-emerald" />
          <h2 className="mt-6 max-w-sm text-balance text-3xl font-semibold leading-tight tracking-tight">
            {t.hero.title}
          </h2>
          <ul className="mt-8 space-y-4">
            {t.authLayout.trustPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                  <Check className="size-4" />
                </span>
                <span className="text-sm text-primary-foreground/80">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
          <Lock className="size-4" />
          {t.authLayout.dataProtected}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo />
          <LanguageSwitcher />
        </div>
        <div className="hidden justify-end p-6 lg:flex">
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t.authLayout.byContinuing}{' '}
              <Link href="/faq" className="text-foreground underline underline-offset-2">
                {t.authLayout.terms}
              </Link>{' '}
              {t.authLayout.and}{' '}
              <Link href="/faq" className="text-foreground underline underline-offset-2">
                {t.authLayout.privacyPolicy}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
