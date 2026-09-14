import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (!user.stripeAccountId) {
    return NextResponse.json({ connected: false, payoutsEnabled: false })
  }

  const stripe = getStripe()
  const account = await stripe.accounts.retrieve(user.stripeAccountId)
  const payoutsEnabled = Boolean(account.payouts_enabled)

  if (payoutsEnabled !== user.payoutsEnabled) {
    await prisma.user.update({ where: { id: user.id }, data: { payoutsEnabled } })
  }

  return NextResponse.json({ connected: true, payoutsEnabled })
}
