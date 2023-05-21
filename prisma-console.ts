const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

async function main() {
  const goalCreationInfo = await prisma.goal.createMany({
    data: [
      {
        content: 'Chadscale Amazon operations',
        description: 'Hire multiple employees to do the dirty',
        completed: false,
        weight: null,
        userId: 'user_2PcPM8gxT9IMUPBI8yq0KnluTmm',
        accountabilityPeriodId: 'clhmi0dvn0000p0j4rn7tulet'
      },
      {
        content: 'Perform high \'fish activity',
        description: 'Enact laser focus towards a single purpose',
        completed: false,
        weight: null,
        userId: 'user_2PcPM8gxT9IMUPBI8yq0KnluTmm',
        accountabilityPeriodId: 'clhmi0dvn0000p0j4rn7tulet'
      },
      {
        content: 'Systematize business operations',
        description: 'Leverage computers to streamline tedious chores',
        completed: false,
        weight: null,
        userId: 'user_2PcPM8gxT9IMUPBI8yq0KnluTmm',
        accountabilityPeriodId: 'clhmi0dvn0000p0j4rn7tulet'
      },
      {
        content: 'Network with high value individual',
        description: 'Facillitate massive gains from trade',
        completed: false,
        weight: null,
        userId: 'user_2PcPM8gxT9IMUPBI8yq0KnluTmm',
        accountabilityPeriodId: 'clhmi0dvn0000p0j4rn7tulet'
      },
      {
        content: 'Offer skillsets to wealthy patron',
        description: 'Evolve society through creative business endeavors',
        completed: false,
        weight: null,
        userId: 'user_2PcPM8gxT9IMUPBI8yq0KnluTmm',
        accountabilityPeriodId: 'clhmi0dvn0000p0j4rn7tulet'
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