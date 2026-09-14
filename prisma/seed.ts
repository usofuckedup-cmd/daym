import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@safedeal.dev' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@safedeal.dev',
      passwordHash: password,
      role: 'ADMIN',
    },
  })

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@safedeal.dev' },
    update: {},
    create: { name: 'Alex Karimov', email: 'buyer@safedeal.dev', passwordHash: password },
  })

  const seller = await prisma.user.upsert({
    where: { email: 'seller@safedeal.dev' },
    update: {},
    create: { name: 'Daniel Weber', email: 'seller@safedeal.dev', passwordHash: password },
  })

  await prisma.deal.upsert({
    where: { id: 'seed-deal-1' },
    update: {},
    create: {
      id: 'seed-deal-1',
      title: 'MacBook Pro 16" M3 Max',
      description: 'Barely used, includes original box and charger.',
      amount: 320000, // $3,200.00 in cents
      currency: 'usd',
      status: 'awaiting_payment',
      buyerId: buyer.id,
      sellerId: seller.id,
      sellerEmail: seller.email,
    },
  })

  console.log('Seeded:')
  console.log('  Admin:  admin@safedeal.dev  / password123')
  console.log('  Buyer:  buyer@safedeal.dev  / password123')
  console.log('  Seller: seller@safedeal.dev / password123')
  void admin
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
