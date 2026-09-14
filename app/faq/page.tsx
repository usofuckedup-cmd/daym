'use client'

import Link from 'next/link'
import { LifeBuoy, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FaqAccordion } from '@/components/faq-accordion'
import { useLanguage } from '@/lib/i18n/language-context'

export default function FaqPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <LifeBuoy className="size-3.5 text-emerald" />
              {t.faqPage.badge}
            </span>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t.faqPage.title}
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground">{t.faqPage.subtitle}</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-14">
          <FaqAccordion />

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary p-6 text-center text-primary-foreground sm:flex-row sm:text-left">
            <div>
              <h2 className="font-semibold">{t.faqPage.stillQuestions}</h2>
              <p className="text-sm text-primary-foreground/70">{t.faqPage.stillQuestionsDesc}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-semibold text-emerald-foreground"
            >
              {t.faqPage.contactUs}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
