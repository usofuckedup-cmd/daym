'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { dictionaries, type Dictionary } from '@/lib/i18n/dictionaries'
import { type Locale, defaultLocale } from '@/lib/i18n/config'

const LOCALE_COOKIE = 'locale'

type LanguageContextValue = {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    // Server components read the locale from the cookie, so refresh to re-render them.
    window.location.reload()
  }, [])

  const value = useMemo(() => ({ locale, t: dictionaries[locale], setLocale }), [locale, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
