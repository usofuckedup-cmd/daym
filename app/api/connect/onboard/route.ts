import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const stripe = getStripe()

  let accountId = user.stripeAccountId
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    })
    accountId = account.id
    await prisma.user.update({ where: { id: user.id }, data: { stripeAccountId: accountId } })
  }

  const origin = new URL(req.url).origin

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/profile?connect=refresh`,
    return_url: `${origin}/profile?connect=return`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
