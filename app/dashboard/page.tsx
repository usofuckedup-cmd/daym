import Link from 'next/link'
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AppShell } from '@/components/app-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDealsForUser, roleForUser, getStatusMeta, formatCurrency } from '@/lib/deals'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { t } = await getServerDictionary()
  const deals = await getDealsForUser(session.user.id)

  const activeCount = deals.filter((d) => d.status === 'in_progress').length
  const completedCount = deals.filter((d) => d.status === 'completed').length
  const pendingCount = deals.filter((d) => d.status === 'pending_confirmation').length
  const totalInEscrow = deals
    .filter((d) => d.status === 'in_progress' || d.status === 'pending_confirmation')
    .reduce((sum, d) => sum + d.amount, 0)

  const widgets = [
    { label: t.dashboard.activeDeals, value: String(activeCount), icon: FileText, accent: 'text-blue-600 bg-blue-100' },
    {
      label: t.dashboard.completedDeals,
      value: String(completedCount),
      icon: CheckCircle2,
      accent: 'text-emerald bg-emerald/10',
    },
    {
      label: t.dashboard.pendingConfirmation,
      value: String(pendingCount),
      icon: Clock,
      accent: 'text-amber-600 bg-amber-100',
    },
    {
      label: t.dashboard.inEscrow,
      value: formatCurrency(totalInEscrow),
      icon: Wallet,
      accent: 'text-primary bg-secondary',
    },
  ]

  const recentDeals = deals.slice(0, 6)
  const roleLabel = { Buyer: t.dashboard.buyer, Seller: t.dashboard.seller }

  return (
    <AppShell title={t.nav.dashboard}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {t.dashboard.welcomeBack}, {session.user.name?.split(' ')[0] ?? ''}
            </h2>
            <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
          </div>
          <Link
            href="/create-deal"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-emerald-foreground transition-colors hover:bg-emerald/90"
          >
            <PlusCircle className="size-4" />
            {t.dashboard.createNewDeal}
          </Link>
        </div>

        {/* Widgets */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {widgets.map((w) => {
            const Icon = w.icon
            return (
              <Card key={w.label} className="p-5">
                <div className="flex items-center justify-between">
                  <span className={`flex size-10 items-center justify-center rounded-xl ${w.accent}`}>
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  {w.value}
                </div>
                <div className="text-sm text-muted-foreground">{w.label}</div>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent deals */}
          <Card id="deals" className="scroll-mt-20 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">{t.dashboard.recentDeals}</h3>
            </div>
            <div className="divide-y divide-border">
              {recentDeals.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  {t.dashboard.noDealsYet}{' '}
                  <Link href="/create-deal" className="font-medium text-emerald">
                    {t.dashboard.createFirst}
                  </Link>
                </p>
              )}
              {recentDeals.map((deal) => {
                const meta = getStatusMeta(deal.status, t)
                const role = roleForUser(deal, session.user.id)
                const counterparty = role === 'Buyer' ? deal.seller?.name ?? deal.sellerEmail : deal.buyer.name
                return (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{deal.title}</p>
                        <Badge variant="outline">{role ? roleLabel[role] : ''}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {counterparty} · {deal.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(deal.amount, deal.currency)}
                      </p>
                      <Badge variant={meta.variant} className="mt-1">
                        {meta.label}
                      </Badge>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Card>

          {/* Activity timeline */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground">{t.dashboard.recentUpdated}</h3>
            <div className="mt-5 space-y-5">
              {recentDeals.slice(0, 5).map((deal, i) => (
                <div key={deal.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 size-2.5 rounded-full ${
                        deal.status === 'completed'
                          ? 'bg-emerald'
                          : deal.status === 'disputed'
                            ? 'bg-destructive'
                            : 'bg-blue-500'
                      }`}
                    />
                    {i < recentDeals.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm text-foreground">
                      {deal.title} — {getStatusMeta(deal.status, t).label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {deal.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentDeals.length === 0 && (
                <p className="text-sm text-muted-foreground">{t.dashboard.noActivity}</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="flex flex-col items-start justify-between gap-4 bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold">{t.dashboard.needHelp}</h3>
            <p className="text-sm text-primary-foreground/70">{t.dashboard.needHelpDesc}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-semibold text-emerald-foreground"
          >
            {t.dashboard.contactSupport}
            <ArrowRight className="size-4" />
          </Link>
        </Card>
      </div>
    </AppShell>
  )
}
