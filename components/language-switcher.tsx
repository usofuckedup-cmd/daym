'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { locales, localeNames } from '@/lib/i18n/config'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Languages className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof locales)[number])}
        aria-label="Language"
        className="h-9 appearance-none rounded-lg border border-border bg-background py-0 pl-8 pr-3 text-sm font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-4 focus-visible:ring-emerald/15"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </div>
  )
}
