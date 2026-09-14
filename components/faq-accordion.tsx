'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function FaqAccordion() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {t.faqAccordion.items.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={faq.q} className="overflow-hidden rounded-2xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-foreground">{faq.q}</span>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
