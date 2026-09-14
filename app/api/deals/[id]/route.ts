import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDealById, openDispute, roleForUser } from '@/lib/deals'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

const actionSchema = z.object({
  action: z.enum(['release', 'dispute', 'deliver']),
  reason: z.string().optional(),
})

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const deal = await getDealById(id)
  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const role = roleForUser(deal, session.user.id)
  if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ deal, role })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const deal = await getDealById(id)
  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const role = roleForUser(deal, session.user.id)
  if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = actionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  if (parsed.data.action === 'release') {
    if (role !== 'Buyer') {
      return NextResponse.json({ error: 'Only the buyer can release funds' }, { status: 403 })
    }
    if (deal.status !== 'in_progress' && deal.status !== 'pending_confirmation') {
      return NextResponse.json({ error: 'Deal cannot be released in its current status' }, { status: 400 })
    }
    if (!deal.stripePaymentIntentId) {
      return NextResponse.json({ error: 'No payment found for this deal' }, { status: 400 })
    }
    if (!deal.seller) {
      return NextResponse.json(
        { error: 'The seller has not created an account yet, so funds cannot be paid out.' },
        { status: 400 },
      )
    }
    if (!deal.seller.stripeAccountId || !deal.seller.payoutsEnabled) {
      return NextResponse.json(
        {
          error:
            "The seller hasn't finished connecting their payout account yet. Ask them to complete Stripe onboarding from their Profile page before releasing funds.",
        },
        { status: 400 },
      )
    }

    const stripe = getStripe()

    // 1) Actually capture the held payment — if this fails, the deal must NOT
    //    become completed, since no money has moved yet.
    try {
      const intent = await stripe.paymentIntents.capture(deal.stripePaymentIntentId)
      if (intent.status !== 'succeeded') {
        return NextResponse.json(
          { error: `Payment capture did not succeed (status: ${intent.status})` },
          { status: 502 },
        )
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown Stripe error'
      return NextResponse.json({ error: `Stripe capture failed: ${message}` }, { status: 502 })
    }

    // 2) Now that funds are captured into the platform balance, pay the seller out.
    let transferId: string
    try {
      const transfer = await stripe.transfers.create({
        amount: deal.amount,
        currency: deal.currency,
        destination: deal.seller.stripeAccountId,
        transfer_group: deal.id,
        description: `SafeDeal payout — ${deal.title}`,
      })
      transferId = transfer.id
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown Stripe error'
      // Money was captured but not yet paid out — deal stays in progress rather than
      // silently completing, so this can be retried instead of losing track of it.
      return NextResponse.json(
        { error: `Payment was captured, but payout to the seller failed: ${message}. Please try again.` },
        { status: 502 },
      )
    }

    const updated = await prisma.deal.update({
      where: { id },
      data: { status: 'completed', stripeTransferId: transferId },
    })
    return NextResponse.json({ deal: updated })
  }

  if (parsed.data.action === 'deliver') {
    if (role !== 'Seller') {
      return NextResponse.json({ error: 'Only the seller can mark the deal as delivered' }, { status: 403 })
    }
    if (deal.status !== 'in_progress') {
      return NextResponse.json({ error: 'Deal must be in progress to mark as delivered' }, { status: 400 })
    }
    const updated = await prisma.deal.update({ where: { id }, data: { status: 'pending_confirmation' } })
    return NextResponse.json({ deal: updated })
  }

  // dispute
  const updated = await openDispute(id, parsed.data.reason ?? 'No reason provided')
  return NextResponse.json({ deal: updated })
}
