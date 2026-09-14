'use client'

import { Lock, Zap, Scale } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'

const icons = [Lock, Zap, Scale]

export function Features() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="grid gap-5 md:grid-cols-3">
        {t.features.items.map((feature, i) => {
          const Icon = icons[i]
          return (
            <Card key={feature.title} className="p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
