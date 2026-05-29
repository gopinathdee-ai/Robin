import { UserRole, ContentType } from '@prisma/client'
import { prisma } from './prisma-client'

async function main() {
  console.log('\n⏳ Seeding optional test data...\n')

  // Get or find Electrician trade
  const electrician = await prisma.trade.findUnique({
    where: { code: 'RED_309A' },
  })
  if (!electrician) {
    console.error('Electrician trade not found. Run `pnpm db:seed:mandatory` first.')
    process.exit(1)
  }

  // Create test users
  console.log('  → Creating test users...')
  const apprentice = await prisma.user.upsert({
    where: { email: 'apprentice@trades.test' },
    create: {
      email: 'apprentice@trades.test',
      displayName: 'Alex Apprentice',
      role: 'apprentice',
      status: 'active',
      provinceCode: 'AB',
      yearsExperience: 1,
    },
    update: {},
  })

  const journeyperson = await prisma.user.upsert({
    where: { email: 'journeyperson@trades.test' },
    create: {
      email: 'journeyperson@trades.test',
      displayName: 'Jordan Journeyperson',
      role: 'journeyperson',
      status: 'active',
      provinceCode: 'AB',
      yearsExperience: 5,
    },
    update: {},
  })

  const master = await prisma.user.upsert({
    where: { email: 'master@trades.test' },
    create: {
      email: 'master@trades.test',
      displayName: 'Morgan Master',
      role: 'master',
      status: 'active',
      provinceCode: 'AB',
      yearsExperience: 15,
    },
    update: {},
  })

  console.log('    ✓ 3 test users (apprentice, journeyperson, master)')

  // Assign trades to users
  console.log('  → Associating users with Electrician trade...')
  await prisma.userTrade.upsert({
    where: { userId_tradeId: { userId: apprentice.id, tradeId: electrician.id } },
    create: {
      userId: apprentice.id,
      tradeId: electrician.id,
      isPrimary: true,
    },
    update: {},
  })

  await prisma.userTrade.upsert({
    where: { userId_tradeId: { userId: journeyperson.id, tradeId: electrician.id } },
    create: {
      userId: journeyperson.id,
      tradeId: electrician.id,
      isPrimary: true,
      verifiedAt: new Date(),
      redSealNumber: 'RED-123456',
    },
    update: {},
  })

  await prisma.userTrade.upsert({
    where: { userId_tradeId: { userId: master.id, tradeId: electrician.id } },
    create: {
      userId: master.id,
      tradeId: electrician.id,
      isPrimary: true,
      verifiedAt: new Date(),
      redSealNumber: 'RED-789012',
    },
    update: {},
  })
  console.log('    ✓ Users linked to trade')

  // Create a reputation score for the journeyperson
  console.log('  → Creating reputation scores...')
  await prisma.reputationScore.upsert({
    where: { userId: journeyperson.id },
    create: {
      userId: journeyperson.id,
      totalScore: 250,
      contentScore: 100,
      peerEndorsementScore: 100,
      mentorshipScore: 50,
      tier: 'journeyperson',
      mentorEligible: true,
      mentorEligibleAt: new Date(),
    },
    update: {},
  })
  console.log('    ✓ Reputation scores')

  // Create sample content (question)
  console.log('  → Creating sample content...')
  const question = await prisma.content.upsert({
    where: { id: 'sample-question-001' },
    create: {
      id: 'sample-question-001',
      authorId: apprentice.id,
      type: 'question',
      tradeId: electrician.id,
      title: 'How do I properly install a circuit breaker panel?',
      body: 'I am learning to install circuit breaker panels and would like to know the steps and safety considerations.',
      status: 'published',
      aiQualityScore: 0.85,
      aiDomainScore: 0.9,
      aiScreenedAt: new Date(),
      publishedAt: new Date(),
    },
    update: {
      status: 'published',
      aiQualityScore: 0.85,
      aiDomainScore: 0.9,
      publishedAt: new Date(),
    },
  })

  // Create sample answer
  const answer = await prisma.content.upsert({
    where: { id: 'sample-answer-001' },
    create: {
      id: 'sample-answer-001',
      authorId: journeyperson.id,
      type: 'answer',
      parentId: question.id,
      body: 'Here are the key steps: 1) Turn off main breaker, 2) Install breaker in proper slot, 3) Check connections, 4) Test with multimeter.',
      status: 'published',
      isAccepted: true,
      aiQualityScore: 0.92,
      aiDomainScore: 0.95,
      aiScreenedAt: new Date(),
      publishedAt: new Date(),
    },
    update: {
      isAccepted: true,
      status: 'published',
      aiQualityScore: 0.92,
      aiDomainScore: 0.95,
      publishedAt: new Date(),
    },
  })
  console.log('    ✓ Sample question and answer')

  // Create a sample credential
  console.log('  → Creating sample credential...')
  await prisma.credential.upsert({
    where: { id: 'sample-cred-001' },
    create: {
      id: 'sample-cred-001',
      holderId: journeyperson.id,
      type: 'red_seal',
      name: 'Red Seal Certification - Electrician',
      tradeId: electrician.id,
      issuedAt: new Date('2024-01-15'),
      isPublic: true,
    },
    update: {},
  })
  console.log('    ✓ Sample credential')

  // Update platform settings for dev mode
  console.log('  → Updating platform settings for development...')
  await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      endorsementMinContributions: 1,
      endorsementMinReputation: 20,
      endorsementMinAccountAgeDays: 0,
      endorsementCooldownDays: 30,
      mentorTierThreshold: 750,
      contentReviewSLAHours: 24,
    },
    update: {
      endorsementMinContributions: 1,
      endorsementMinReputation: 20,
      endorsementMinAccountAgeDays: 0,
    },
  })
  console.log('    ✓ Platform settings updated for dev mode')

  console.log('\n✓ Optional test data seeding complete.')
  console.log('  Test IDs for reference:')
  console.log(`    - Apprentice: ${apprentice.id}`)
  console.log(`    - Journeyperson: ${journeyperson.id}`)
  console.log(`    - Master: ${master.id}`)
  console.log(`    - Question: ${question.id}`)
  console.log(`    - Answer: ${answer.id}\n`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
