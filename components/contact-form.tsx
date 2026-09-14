'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/language-context'

export function ContactForm() {
  const { t } = useLanguage()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      topic: String(formData.get('topic') ?? t.contactForm.topics[0]),
      message: String(formData.get('message') ?? ''),
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? t.contactForm.genericError)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-foreground">{t.contactForm.sentTitle}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.contactForm.sentDesc}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t.contactForm.sendAnother}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-border bg-card p-6"
    >
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{t.contactForm.nameLabel}</Label>
          <Input id="name" name="name" placeholder={t.contactForm.namePlaceholder} required />
        </div>
        <div>
          <Label htmlFor="email">{t.contactForm.emailLabel}</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
      </div>
      <div>
        <Label htmlFor="topic">{t.contactForm.topicLabel}</Label>
        <select
          id="topic"
          name="topic"
          className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15"
        >
          {t.contactForm.topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="message">{t.contactForm.messageLabel}</Label>
        <Textarea id="message" name="message" placeholder={t.contactForm.messagePlaceholder} required />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? t.contactForm.sending : t.contactForm.submit}
        {!loading && <Send className="size-4" />}
      </button>
    </form>
  )
}
