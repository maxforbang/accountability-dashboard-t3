const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

async function main() {
  const goalCreationInfo = await prisma.goal.createMany({
    data: [
      {
        content: '$40k/mo Online Arbitrage',
        description: '',
        completed: false,
        weight: null,
        userId: 'user_2PcPLD4cCl4solXYo6RJ1blzEfd',
        accountabilityPeriodId: 'cli2eoegs0000p0g6lhjluivm'
      },
      {
        content: '$20k/mo Wholesale & Private Label',
        description: '',
        completed: false,
        weight: null,
        userId: 'user_2PcPLD4cCl4solXYo6RJ1blzEfd',
        accountabilityPeriodId: 'cli2eoegs0000p0g6lhjluivm'
      },
      {
        content: '$10k/mo Sales Commissions',
        description: '',
        completed: false,
        weight: null,
        userId: 'user_2PcPLD4cCl4solXYo6RJ1blzEfd',
        accountabilityPeriodId: 'cli2eoegs0000p0g6lhjluivm'
      },
      
    ]
  });
  
  console.log("Created goals: ", goalCreationInfo.count);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })