import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDealById, roleForUser } from '@/lib/deals'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const deal = await getDealById(id)
  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const role = roleForUser(deal, session.user.id)
  if (role !== 'Buyer') {
    return NextResponse.json({ error: 'Only the buyer can fund this deal' }, { status: 403 })
  }
  if (deal.status !== 'awaiting_payment') {
    return NextResponse.json({ error: 'Deal is not awaiting payment' }, { status: 400 })
  }

  const origin = new URL(req.url).origin
  const stripe = getStripe()

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    // manual capture = money is authorized/held, not actually settled, until we call capture
    payment_intent_data: { capture_method: 'manual' },
    line_items: [
      {
        price_data: {
          currency: deal.currency,
          product_data: { name: deal.title },
          unit_amount: deal.amount,
        },
        quantity: 1,
      },
    ],
    metadata: { dealId: deal.id },
    success_url: `${origin}/deals/${deal.id}?funded=1`,
    cancel_url: `${origin}/deals/${deal.id}?funded=0`,
  })

  await prisma.deal.update({
    where: { id: deal.id },
    data: { stripeCheckoutSessionId: checkoutSession.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
