'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/language-context'

const currencies = ['USD', 'EUR', 'GBP', 'AED']

export function CreateDealForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const numeric = Number(price) || 0
  const fee = Math.round(numeric * 0.02 * 100) / 100

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      amount: Number(formData.get('price') ?? 0),
      currency: String(formData.get('currency') ?? 'USD').toLowerCase(),
      sellerEmail: String(formData.get('seller') ?? ''),
      dueDate: String(formData.get('date') ?? ''),
    }

    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? t.createDeal.genericError)
      return
    }

    router.push(`/deals/${data.deal.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
          <Card className="p-6">
            <h2 className="text-base font-semibold text-foreground">{t.createDeal.partiesTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.createDeal.partiesDesc}</p>
            <div className="mt-5">
              <Label htmlFor="seller">{t.createDeal.sellerEmailLabel}</Label>
              <Input id="seller" name="seller" type="email" placeholder="seller@example.com" required />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-foreground">{t.createDeal.dealDetailsTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.createDeal.dealDetailsDesc}</p>
            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="title">{t.createDeal.dealTitleLabel}</Label>
                <Input id="title" name="title" placeholder={t.createDeal.dealTitlePlaceholder} required />
              </div>
              <div>
                <Label htmlFor="description">{t.createDeal.descriptionLabel}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t.createDeal.descriptionPlaceholder}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="price">{t.createDeal.priceLabel}</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">{t.createDeal.currencyLabel}</Label>
                  <select
                    id="currency"
                    name="currency"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15"
                  >
                    {currencies.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="method">{t.createDeal.deliveryMethodLabel}</Label>
                  <select
                    id="method"
                    name="method"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15"
                  >
                    {t.createDeal.methods.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">{t.createDeal.expectedDateLabel}</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24 p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald" />
              <h2 className="text-base font-semibold text-foreground">{t.createDeal.escrowSummaryTitle}</h2>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t.createDeal.dealAmount}</dt>
                <dd className="font-medium text-foreground">${numeric.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t.createDeal.fee}</dt>
                <dd className="font-medium text-foreground">${fee.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <dt className="font-semibold text-foreground">{t.createDeal.heldInEscrow}</dt>
                <dd className="text-base font-semibold text-emerald">
                  ${(numeric + fee).toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex gap-2 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
              <Info className="size-4 shrink-0 text-emerald" />
              {t.createDeal.infoText}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? t.createDeal.submitting : t.createDeal.submit}
              {!loading && <ArrowRight className="size-4" />}
            </button>
          </Card>
        </div>
      </form>
  )
}
