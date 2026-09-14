import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { createDeal, getDealsForUser } from '@/lib/deals'

const createDealSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  amount: z.number().positive(), // in whole currency units, e.g. dollars
  currency: z.string().default('usd'),
  sellerEmail: z.string().email(),
  dueDate: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deals = await getDealsForUser(session.user.id)
  return NextResponse.json({ deals })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = createDealSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { title, description, amount, currency, sellerEmail, dueDate } = parsed.data

  const deal = await createDeal({
    title,
    description,
    amountCents: Math.round(amount * 100),
    currency,
    buyerId: session.user.id,
    sellerEmail,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  })

  return NextResponse.json({ deal }, { status: 201 })
}
