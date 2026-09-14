'use client'

import { useEffect, useState } from 'react'
import { Wallet, CheckCircle2, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/i18n/language-context'

export function PayoutSetupCard({
  initialConnected,
  initialPayoutsEnabled,
}: {
  initialConnected: boolean
  initialPayoutsEnabled: boolean
}) {
  const [connected, setConnected] = useState(initialConnected)
  const [payoutsEnabled, setPayoutsEnabled] = useState(initialPayoutsEnabled)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  async function refreshStatus() {
    setChecking(true)
    try {
      const res = await fetch('/api/connect/status')
      if (res.ok) {
        const data = await res.json()
        setConnected(data.connected)
        setPayoutsEnabled(data.payoutsEnabled)
      }
    } finally {
      setChecking(false)
    }
  }

  // If we just came back from Stripe onboarding, re-check status once.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('connect') === 'return') {
      refreshStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startOnboarding() {
    setError(null)
    setLoading(true)
    const res = await fetch('/api/connect/onboard', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? t.payoutCard.genericError)
      return
    }
    window.location.href = data.url
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">{t.payoutCard.title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t.payoutCard.description}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {payoutsEnabled ? (
          <Badge variant="emerald">
            <CheckCircle2 className="size-3.5" />
            {t.payoutCard.payoutsEnabled}
          </Badge>
        ) : connected ? (
          <Badge variant="warning">{t.payoutCard.onboardingIncomplete}</Badge>
        ) : (
          <Badge variant="outline">{t.payoutCard.notConnected}</Badge>
        )}

        {!payoutsEnabled && (
          <button
            type="button"
            onClick={startOnboarding}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? t.payoutCard.redirecting : connected ? t.payoutCard.finishOnboarding : t.payoutCard.connectButton}
            {!loading && <ExternalLink className="size-4" />}
          </button>
        )}

        <button
          type="button"
          onClick={refreshStatus}
          disabled={checking}
          className="text-sm font-medium text-muted-foreground underline-offset-2 hover:underline disabled:opacity-60"
        >
          {checking ? t.payoutCard.checking : t.payoutCard.refreshStatus}
        </button>
      </div>
    </Card>
  )
}
