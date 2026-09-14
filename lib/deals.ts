import { prisma } from '@/lib/prisma'
import type { DealStatus as PrismaDealStatus } from '@prisma/client'
import type { Dictionary } from '@/lib/i18n/dictionaries'

export type DealStatus = PrismaDealStatus

export const statusVariant: Record<
  DealStatus,
  'emerald' | 'warning' | 'blue' | 'default' | 'destructive'
> = {
  awaiting_payment: 'warning',
  in_progress: 'blue',
  pending_confirmation: 'warning',
  completed: 'emerald',
  disputed: 'destructive',
  cancelled: 'default',
}

export function getStatusMeta(status: DealStatus, t: Dictionary) {
  return { label: t.dealStatus[status], variant: statusVariant[status] }
}

export function formatCurrency(amountCents: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100)
}

/** All deals where the given user is either buyer or seller. */
export async function getDealsForUser(userId: string) {
  return prisma.deal.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    include: { buyer: true, seller: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDealById(id: string) {
  return prisma.deal.findUnique({
    where: { id },
    include: {
      buyer: true,
      seller: true,
      dispute: true,
      messages: { include: { author: true }, orderBy: { createdAt: 'asc' } },
    },
  })
}

export function roleForUser(
  deal: { buyerId: string; sellerId: string | null },
  userId: string,
): 'Buyer' | 'Seller' | null {
  if (deal.buyerId === userId) return 'Buyer'
  if (deal.sellerId === userId) return 'Seller'
  return null
}

export async function createDeal(params: {
  title: string
  description?: string
  amountCents: number
  currency?: string
  buyerId: string
  sellerEmail: string
  dueDate?: Date
}) {
  const existingSeller = await prisma.user.findUnique({ where: { email: params.sellerEmail } })

  return prisma.deal.create({
    data: {
      title: params.title,
      description: params.description,
      amount: params.amountCents,
      currency: params.currency ?? 'usd',
      buyerId: params.buyerId,
      sellerId: existingSeller?.id,
      sellerEmail: params.sellerEmail,
      dueDate: params.dueDate,
    },
  })
}

export async function markPaid(dealId: string, paymentIntentId: string) {
  return prisma.deal.update({
    where: { id: dealId },
    data: { status: 'in_progress', stripePaymentIntentId: paymentIntentId },
  })
}

export async function releaseFunds(dealId: string) {
  return prisma.deal.update({
    where: { id: dealId },
    data: { status: 'completed' },
  })
}

export async function openDispute(dealId: string, reason: string) {
  await prisma.dispute.create({ data: { dealId, reason } })
  return prisma.deal.update({ where: { id: dealId }, data: { status: 'disputed' } })
}
