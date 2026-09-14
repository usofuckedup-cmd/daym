'use client'

import { Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function WhyChoose() {
  const { t } = useLanguage()

  return (
    <section id="why" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-emerald">{t.whyChoose.eyebrow}</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.whyChoose.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.whyChoose.reasons.map((reason) => (
            <div
              key={reason}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
                <Check className="size-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
