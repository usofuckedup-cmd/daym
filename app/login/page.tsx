'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowRight } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/i18n/language-context'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(t.login.invalidCredentials)
      return
    }

    router.push(searchParams.get('callbackUrl') || '/dashboard')
  }

  return (
    <AuthLayout title={t.login.title} subtitle={t.login.subtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        <div>
          <Label htmlFor="email">{t.login.emailLabel}</Label>
          <Input id="email" name="email" type="email" placeholder={t.login.emailPlaceholder} required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.login.passwordLabel}</Label>
          </div>
          <Input id="password" name="password" type="password" placeholder={t.login.passwordPlaceholder} required />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? t.login.submitting : t.login.submit}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.login.noAccount}{' '}
        <Link href="/register" className="font-semibold text-emerald">
          {t.login.registerLink}
        </Link>
      </p>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
