'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function Stats() {
  const { t } = useLanguage()

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
          <div className="grid gap-10 sm:grid-cols-3">
            {t.stats.items.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-semibold tracking-tight text-emerald sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {t.stats.ctaTitle}
            </h2>
            <p className="mt-3 text-pretty text-primary-foreground/70">{t.stats.ctaSubtitle}</p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-3.5 text-sm font-semibold text-emerald-foreground transition-colors hover:bg-emerald/90"
              >
                {t.stats.ctaButton}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
