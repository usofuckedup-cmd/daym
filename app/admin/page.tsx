import { redirect } from 'next/navigation'
import { Users, ArrowLeftRight, ShieldAlert, DollarSign, TrendingUp } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/components/app-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getStatusMeta } from '@/lib/deals'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  // @ts-expect-error - role is attached via the auth() session callback
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { t } = await getServerDictionary()

  const [userCount, dealCount, openDisputes, allDeals, recentDeals] = await Promise.all([
    prisma.user.count(),
    prisma.deal.count(),
    prisma.dispute.count({ where: { status: { not: 'resolved' } } }),
    prisma.deal.findMany({ select: { amount: true, status: true } }),
    prisma.deal.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 8,
      include: { buyer: true, seller: true },
    }),
  ])

  const totalInEscrow = allDeals
    .filter((d) => d.status === 'in_progress' || d.status === 'pending_confirmation')
    .reduce((sum, d) => sum + d.amount, 0)

  const kpis = [
    { label: t.adminPage.totalUsers, value: userCount.toLocaleString(), icon: Users },
    { label: t.adminPage.totalDealsLabel, value: dealCount.toLocaleString(), icon: ArrowLeftRight },
    { label: t.adminPage.openDisputes, value: openDisputes.toLocaleString(), icon: ShieldAlert },
    { label: t.adminPage.heldInEscrow, value: formatCurrency(totalInEscrow), icon: DollarSign },
  ]

  return (
    <AppShell title={t.nav.admin}>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t.adminPage.overviewTitle}</h2>
          <p className="text-sm text-muted-foreground">{t.adminPage.overviewDesc}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  {kpi.value}
                </div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
              </Card>
            )
          })}
        </div>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-semibold text-foreground">{t.adminPage.recentDealsTitle}</h3>
            <Badge variant="emerald">
              <TrendingUp className="size-3.5" />
              {t.adminPage.live}
            </Badge>
          </div>
          <div className="divide-y divide-border">
            {recentDeals.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">{t.adminPage.noDeals}</p>
            )}
            {recentDeals.map((deal) => {
              const meta = getStatusMeta(deal.status, t)
              return (
                <div key={deal.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{deal.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {deal.buyer.name} → {deal.seller?.name ?? deal.sellerEmail} · {deal.id}
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
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground">{t.adminPage.identityVerificationTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t.adminPage.identityVerificationDesc}</p>
        </Card>
      </div>
    </AppShell>
  )
}
