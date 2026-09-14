import { redirect } from 'next/navigation'
import { BadgeCheck, Mail, CheckCircle2, CalendarDays, ArrowLeftRight } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/components/app-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PayoutSetupCard } from '@/components/payout-setup-card'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { t, locale } = await getServerDictionary()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      createdAt: true,
      role: true,
      stripeAccountId: true,
      payoutsEnabled: true,
    },
  })
  if (!user) redirect('/login')

  const [totalDeals, completedDeals] = await Promise.all([
    prisma.deal.count({ where: { OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] } }),
    prisma.deal.count({
      where: { status: 'completed', OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] },
    }),
  ])

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const localeTag = locale === 'kk' ? 'kk-KZ' : 'ru-RU'

  const stats = [
    { label: t.profile.totalDeals, value: String(totalDeals), icon: ArrowLeftRight },
    { label: t.profile.completedDeals, value: String(completedDeals), icon: CheckCircle2 },
    {
      label: t.profile.memberSince,
      value: user.createdAt.toLocaleDateString(localeTag, { month: 'short', year: 'numeric' }),
      icon: CalendarDays,
    },
  ]

  return (
    <AppShell title={t.nav.profile}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span className="flex size-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                {initials}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.role === 'ADMIN' && (
              <Badge variant="emerald" className="mt-3">
                <BadgeCheck className="size-3.5" />
                {t.profile.admin}
              </Badge>
            )}
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.label} className="p-5">
                  <Icon className="size-5 text-emerald" />
                  <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </Card>
              )
            })}
          </div>

          {/* Payouts */}
          <PayoutSetupCard initialConnected={!!user.stripeAccountId} initialPayoutsEnabled={user.payoutsEnabled} />

          {/* Verification - honest state, not implemented yet */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground">{t.profile.verificationTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.profile.verificationDesc}</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-4 rounded-xl border border-border px-4 py-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <Mail className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t.profile.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="emerald">
                  <CheckCircle2 className="size-3.5" />
                  {t.profile.onFile}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
