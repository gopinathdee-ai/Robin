import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TRADES = [
  { code: 'RED_309A', name: 'Electrician (Construction)' },
  { code: 'RED_306A', name: 'Plumber' },
  { code: 'RED_313A', name: 'Refrigeration & Air Conditioning Mechanic' },
  { code: 'RED_308A', name: 'Steamfitter/Pipefitter' },
  { code: 'RED_421A', name: 'Welder' },
  { code: 'RED_310A', name: 'Industrial Electrician' },
  { code: 'RED_433A', name: 'Ironworker (Generalist)' },
  { code: 'RED_301A', name: 'Carpenter' },
]

const EXPERTISE_TOPICS = [
  { name: 'Panel Installation & Wiring', slug: 'panel-installation-wiring' },
  { name: 'Conduit & Cable Management', slug: 'conduit-cable-management' },
  { name: 'Code Compliance & Inspections', slug: 'code-compliance-inspections' },
  { name: 'Troubleshooting & Diagnostics', slug: 'troubleshooting-diagnostics' },
  { name: 'Safety Protocols', slug: 'safety-protocols' },
  { name: 'Apprenticeship & Mentoring', slug: 'apprenticeship-mentoring' },
  { name: 'Tools & Equipment', slug: 'tools-equipment' },
]

async function main() {
  console.log('\n⏳ Seeding mandatory reference data...\n')

  // Seed trades
  console.log(`  → Upserting ${TRADES.length} Red Seal trades...`)
  for (const trade of TRADES) {
    await prisma.trade.upsert({
      where: { code: trade.code },
      create: {
        code: trade.code,
        name: trade.name,
        isRedSeal: true,
        isActive: true,
      },
      update: {},
    })
  }
  console.log(`    ✓ ${TRADES.length} trades`)

  // Seed expertise topics for Electrician (RED_309A)
  const electrician = await prisma.trade.findUnique({
    where: { code: 'RED_309A' },
  })

  if (electrician) {
    console.log(`  → Upserting ${EXPERTISE_TOPICS.length} expertise topics for Electrician...`)
    for (const topic of EXPERTISE_TOPICS) {
      await prisma.expertiseTopic.upsert({
        where: { slug: topic.slug },
        create: {
          slug: topic.slug,
          name: topic.name,
          tradeId: electrician.id,
          isActive: true,
        },
        update: {},
      })
    }
    console.log(`    ✓ ${EXPERTISE_TOPICS.length} topics`)
  }

  // Seed platform settings (production defaults)
  console.log(`  → Upserting platform settings...`)
  await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      // Endorsement gate thresholds (production)
      endorsementMinContributions: 20,
      endorsementMinReputation: 50,
      endorsementMinAccountAgeDays: 60,
      endorsementCooldownDays: 30,
      // Reputation thresholds
      mentorTierThreshold: 750,
      // Content review SLA
      contentReviewSLAHours: 24,
    },
    update: {},
  })
  console.log(`    ✓ Platform settings`)

  console.log('\n✓ Mandatory seeding complete.')
  console.log('  Database is production-ready with reference data.\n')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
