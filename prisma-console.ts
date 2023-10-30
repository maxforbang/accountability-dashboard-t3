const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

async function main() {
  const goalUpdateInfo = await prisma.goal.updateMany({
    where: {
      userId: "user_2PcPAQ9OxV5HK6kWpLEVylFpN4w"
    },
    data: {
      userId: "user_2Vak4GRYutPDvUGcmG9zHgTACOb"
    }
  });
  
  console.log("Updated goals: ", goalUpdateInfo.count);
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