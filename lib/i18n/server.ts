import { cookies } from 'next/headers'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config'

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get('locale')?.value
  return isLocale(value) ? value : defaultLocale
}

export async function getServerDictionary() {
  const locale = await getServerLocale()
  return { locale, t: dictionaries[locale] }
}
