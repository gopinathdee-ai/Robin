const { PrismaClient } = require('@trades/db');

const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 Reputation Data Check:\n');

  const users = await prisma.user.findMany({
    where: { email: { endsWith: '.test' } },
    select: {
      id: true,
      displayName: true,
      email: true,
      reputationScore: true,
      trades: {
        where: { isPrimary: true },
        select: { trade: { select: { code: true } } }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log('Users with seeded data:');
  users.forEach(user => {
    const score = user.reputationScore?.totalScore ?? 'NO RECORD';
    const trade = user.trades[0]?.trade?.code ?? 'NO TRADE';
    console.log(`  ${user.displayName.padEnd(20)} Score: ${score.toString().padEnd(5)} Trade: ${trade}`);
  });

  console.log('\n📈 Raw Reputation Scores Table:\n');
  const scores = await prisma.reputationScore.findMany({
    select: { userId: true, totalScore: true, tier: true }
  });
  console.log(scores);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
