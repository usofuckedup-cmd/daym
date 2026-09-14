'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="inline-flex size-1.5 rounded-full bg-emerald" />
            {t.hero.badge}
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create-deal"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-3.5 text-sm font-semibold text-emerald-foreground transition-colors hover:bg-emerald/90"
            >
              {t.hero.createDeal}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {t.hero.learnMore}
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald" />
              {t.hero.bankLevel}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald" />
              {t.hero.support24}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-secondary/60" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-[0_20px_60px_-24px_rgba(11,31,68,0.25)]">
            <Image
              src="/hero-escrow-flow.png"
              alt="Money moving safely through SafeDeal escrow between a buyer and a seller"
              width={720}
              height={560}
              className="h-auto w-full rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
