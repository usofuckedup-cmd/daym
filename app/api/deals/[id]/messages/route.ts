import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDealById, roleForUser } from '@/lib/deals'
import { prisma } from '@/lib/prisma'

const messageSchema = z.object({ body: z.string().min(1).max(2000) })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
  const parsed = messageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const message = await prisma.dealMessage.create({
    data: { dealId: id, authorId: session.user.id, body: parsed.data.body },
    include: { author: true },
  })

  return NextResponse.json({ message }, { status: 201 })
}
