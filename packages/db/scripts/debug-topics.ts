import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check ALL trades first
  const allTrades = await prisma.trade.findMany()
  console.log('\n🏢 ALL TRADES IN DATABASE:')
  console.log(JSON.stringify(allTrades, null, 2))

  const tradeId = '8468135a-8644-4728-a317-1ac3c41962c8'

  // Check if trade exists
  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
  })
  console.log('\n📋 Your selected trade:', trade)

  // Check all topics for this trade
  const topicsForTrade = await prisma.expertiseTopic.findMany({
    where: { tradeId: tradeId },
  })
  console.log('\n📚 All topics for your selected trade:', topicsForTrade)

  // Check ALL topics in database with their trades
  const allTopics = await prisma.expertiseTopic.findMany({
    include: { trade: true },
  })
  console.log('\n🌍 ALL topics in database:')
  console.log(JSON.stringify(allTopics, null, 2))

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
