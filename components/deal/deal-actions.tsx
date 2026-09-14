'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, ShieldAlert, CheckCircle2 } from 'lucide-react'
import type { DealStatus } from '@/lib/deals'
import { useLanguage } from '@/lib/i18n/language-context'

export function DealActions({
  dealId,
  status,
  role,
}: {
  dealId: string
  status: DealStatus
  role: 'Buyer' | 'Seller'
}) {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState<'fund' | 'release' | 'dispute' | 'deliver' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [reason, setReason] = useState('')

  async function markDelivered() {
    setError(null)
    setLoading('deliver')
    const res = await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deliver' }),
    })
    const data = await res.json()
    setLoading(null)
    if (!res.ok) {
      setError(data.error ?? t.dealActions.genericError)
      return
    }
    router.refresh()
  }

  async function fund() {
    setError(null)
    setLoading('fund')
    const res = await fetch(`/api/deals/${dealId}/fund`, { method: 'POST' })
    const data = await res.json()
    setLoading(null)
    if (!res.ok) {
      setError(data.error ?? t.dealActions.genericError)
      return
    }
    window.location.href = data.url
  }

  async function releaseFunds() {
    setError(null)
    setLoading('release')
    const res = await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'release' }),
    })
    const data = await res.json()
    setLoading(null)
    if (!res.ok) {
      setError(data.error ?? t.dealActions.genericError)
      return
    }
    router.refresh()
  }

  async function submitDispute() {
    setError(null)
    setLoading('dispute')
    const res = await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dispute', reason }),
    })
    const data = await res.json()
    setLoading(null)
    if (!res.ok) {
      setError(data.error ?? t.dealActions.genericError)
      return
    }
    setShowDisputeForm(false)
    router.refresh()
  }

  const canFund = role === 'Buyer' && status === 'awaiting_payment'
  const canDeliver = role === 'Seller' && status === 'in_progress'
  const canRelease = role === 'Buyer' && (status === 'in_progress' || status === 'pending_confirmation')
  const canDispute = status !== 'completed' && status !== 'disputed' && status !== 'cancelled'

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-xl bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</p>
      )}

      {canFund && (
        <button
          type="button"
          onClick={fund}
          disabled={loading === 'fund'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <CreditCard className="size-5" />
          {loading === 'fund' ? t.dealActions.redirecting : t.dealActions.fundButton}
        </button>
      )}

      {canDeliver && (
        <button
          type="button"
          onClick={markDelivered}
          disabled={loading === 'deliver'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <CheckCircle2 className="size-5" />
          {loading === 'deliver' ? t.dealActions.updating : t.dealActions.deliverButton}
        </button>
      )}

      {status === 'in_progress' && role === 'Seller' && (
        <p className="rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
          {t.dealActions.sellerEscrowNote}
        </p>
      )}

      {status === 'pending_confirmation' && role === 'Seller' && (
        <p className="rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
          {t.dealActions.sellerPendingNote}
        </p>
      )}

      {canRelease && (
        <button
          type="button"
          onClick={releaseFunds}
          disabled={loading === 'release'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-3 text-sm font-semibold text-emerald-foreground transition-colors hover:bg-emerald/90 disabled:opacity-60"
        >
          <CheckCircle2 className="size-5" />
          {loading === 'release' ? t.dealActions.releasing : t.dealActions.releaseButton}
        </button>
      )}

      {status === 'completed' && (
        <p className="rounded-xl bg-emerald/10 px-3 py-2 text-xs text-emerald">
          {t.dealActions.completedNote}
        </p>
      )}

      {canDispute && !showDisputeForm && (
        <button
          type="button"
          onClick={() => setShowDisputeForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <ShieldAlert className="size-5" />
          {t.dealActions.openDisputeButton}
        </button>
      )}

      {showDisputeForm && (
        <div className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.dealActions.disputePlaceholder}
            className="h-20 w-full resize-none rounded-lg border border-destructive/20 bg-background px-3 py-2 text-sm text-foreground outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitDispute}
              disabled={loading === 'dispute' || !reason.trim()}
              className="flex-1 rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
            >
              {loading === 'dispute' ? t.dealActions.submittingDispute : t.dealActions.submitDispute}
            </button>
            <button
              type="button"
              onClick={() => setShowDisputeForm(false)}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
            >
              {t.dealActions.cancel}
            </button>
          </div>
        </div>
      )}

      {status === 'disputed' && (
        <p className="rounded-xl bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {t.dealActions.disputedNote}
        </p>
      )}
    </div>
  )
}
