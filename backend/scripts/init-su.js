
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function initSUClub() {
  try {
    const existingSU = await prisma.club.findUnique({
      where: { clubID: 1 },
    });

    if (existingSU) {
      console.log("SU club already exists:", existingSU);
      return;
    }

    await prisma.club.create({
      data: {
        clubID: 1,
        clubName: "Student Union",
        description: "Central Student Union",
        createdAt: new Date(),
        president: 2, 
      },
    });
    await prisma.executive.create({
      data: { userID: 2, clubID: 1, role: "President" },
    });

    console.log("Default SU roles created");
  } catch (error) {
    console.error("Failed to initialize SU club:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

initSUClub();
