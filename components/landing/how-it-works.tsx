'use client'

import { FilePlus2, CreditCard, PackageCheck, BadgeDollarSign } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

const icons = [FilePlus2, CreditCard, PackageCheck, BadgeDollarSign]

export function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-secondary/50 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-emerald">{t.howItWorks.eyebrow}</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">{t.howItWorks.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(11,31,68,0.04)]"
              >
                <span className="text-sm font-semibold text-muted-foreground/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
