'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowRight } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/i18n/language-context'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
    const confirm = String(formData.get('confirm') ?? '')

    if (password !== confirm) {
      setError(t.register.passwordMismatch)
      return
    }

    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setLoading(false)
      setError(data.error ?? t.register.genericError)
      return
    }

    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)

    if (result?.error) {
      setError(t.register.autoLoginFailed)
      router.push('/login')
      return
    }

    router.push('/dashboard')
  }

  return (
    <AuthLayout title={t.register.title} subtitle={t.register.subtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        <div>
          <Label htmlFor="name">{t.register.nameLabel}</Label>
          <Input id="name" name="name" placeholder={t.register.namePlaceholder} required />
        </div>
        <div>
          <Label htmlFor="email">{t.register.emailLabel}</Label>
          <Input id="email" name="email" type="email" placeholder={t.register.emailPlaceholder} required />
        </div>
        <div>
          <Label htmlFor="password">{t.register.passwordLabel}</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
        </div>
        <div>
          <Label htmlFor="confirm">{t.register.confirmLabel}</Label>
          <Input id="confirm" name="confirm" type="password" placeholder="••••••••" required minLength={8} />
        </div>
        <p className="text-xs text-muted-foreground">{t.register.passwordHint}</p>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? t.register.submitting : t.register.submit}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.register.haveAccount}{' '}
        <Link href="/login" className="font-semibold text-emerald">
          {t.register.loginLink}
        </Link>
      </p>
    </AuthLayout>
  )
}
