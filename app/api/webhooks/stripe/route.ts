import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { markPaid } from '@/lib/deals'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  const rawBody = await req.text()
  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as { metadata?: { dealId?: string }; payment_intent?: string }
    const dealId = checkoutSession.metadata?.dealId
    const paymentIntentId = checkoutSession.payment_intent

    if (dealId && paymentIntentId) {
      await markPaid(dealId, paymentIntentId)
    }
  }

  if (event.type === 'account.updated') {
    const account = event.data.object as { id: string; payouts_enabled?: boolean }
    await prisma.user
      .updateMany({
        where: { stripeAccountId: account.id },
        data: { payoutsEnabled: Boolean(account.payouts_enabled) },
      })
      .catch(() => {
        // No matching user yet (e.g. race condition on first onboarding) — safe to ignore,
        // the /api/connect/status check will pick it up next time the profile page loads.
      })
  }

  return NextResponse.json({ received: true })
}
