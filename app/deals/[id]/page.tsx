import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Check, FileText } from 'lucide-react'
import { auth } from '@/auth'
import { AppShell } from '@/components/app-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DealChat } from '@/components/deal/deal-chat'
import { DealActions } from '@/components/deal/deal-actions'
import { getDealById, roleForUser, getStatusMeta, formatCurrency, type DealStatus } from '@/lib/deals'
import { getServerDictionary } from '@/lib/i18n/server'

const order: DealStatus[] = ['awaiting_payment', 'in_progress', 'pending_confirmation', 'completed']

export default async function DealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { t } = await getServerDictionary()
  const { id } = await params
  const deal = await getDealById(id)
  if (!deal) notFound()

  const role = roleForUser(deal, session.user.id)
  if (!role) notFound()

  const meta = getStatusMeta(deal.status, t)
  const steps = [
    { key: 'awaiting_payment' as const, label: t.dealDetail.steps[0].label },
    { key: 'in_progress' as const, label: t.dealDetail.steps[1].label },
    { key: 'pending_confirmation' as const, label: t.dealDetail.steps[2].label },
    { key: 'completed' as const, label: t.dealDetail.steps[3].label },
  ]
  const currentIndex = deal.status === 'disputed' || deal.status === 'cancelled' ? -1 : order.indexOf(deal.status)
  const progress = currentIndex >= 0 ? Math.round(((currentIndex + 1) / order.length) * 100) : 0
  const counterparty = role === 'Buyer' ? deal.seller?.name ?? deal.sellerEmail ?? '' : deal.buyer.name
  const otherRoleLabel = role === 'Buyer' ? t.dealDetail.role.Seller : t.dealDetail.role.Buyer

  return (
    <AppShell title={deal.title}>
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t.dealDetail.backToDashboard}
        </Link>

        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={meta.variant}>{meta.label}</Badge>
                <span className="text-xs text-muted-foreground">{deal.id}</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {deal.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {otherRoleLabel}: {counterparty} · {deal.createdAt.toLocaleDateString()}
              </p>
              {deal.description && (
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{deal.description}</p>
              )}
            </div>
            <div className="rounded-2xl bg-secondary px-5 py-3 text-right">
              <div className="text-xs text-muted-foreground">{t.dealDetail.heldInEscrow}</div>
              <div className="text-2xl font-semibold text-emerald">
                {formatCurrency(deal.amount, deal.currency)}
              </div>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{t.dealDetail.dealProgress}</span>
              <span className="text-muted-foreground">{progress}% {t.dealDetail.percentComplete}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-emerald" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Status timeline */}
          <Card className="p-6 lg:col-span-1">
            <h3 className="font-semibold text-foreground">{t.dealDetail.statusTimeline}</h3>
            <div className="mt-5 space-y-1">
              {steps.map((step, i) => {
                const done = currentIndex >= i
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex size-7 items-center justify-center rounded-full ${
                          done
                            ? 'bg-emerald text-emerald-foreground'
                            : 'border border-border bg-background text-muted-foreground'
                        }`}
                      >
                        {done ? (
                          <Check className="size-4" />
                        ) : (
                          <span className="size-2 rounded-full bg-current" />
                        )}
                      </span>
                      {i < steps.length - 1 && (
                        <span className={`my-1 w-px flex-1 ${done ? 'bg-emerald' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                )
              })}
              {deal.status === 'disputed' && (
                <p className="text-sm font-medium text-destructive">{t.dealDetail.disputedUnderReview}</p>
              )}
            </div>
          </Card>

          {/* Chat */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <DealChat
                dealId={deal.id}
                currentUserId={session.user.id}
                initialMessages={deal.messages.map((m) => ({
                  id: m.id,
                  authorName: m.author.name,
                  authorId: m.authorId,
                  body: m.body,
                  createdAt: m.createdAt.toISOString(),
                }))}
              />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{t.dealDetail.fileAttachmentsTitle}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.dealDetail.fileAttachmentsDesc}</p>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground">{t.dealDetail.actionsTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {role === 'Buyer' ? t.dealDetail.actionsDescBuyer : t.dealDetail.actionsDescSeller}
          </p>
          <div className="mt-5 max-w-md">
            <DealActions dealId={deal.id} status={deal.status} role={role} />
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
