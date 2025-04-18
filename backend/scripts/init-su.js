//to run this script run node init-su.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function initSUClub() {
  try {
    // Check if SU club exists
    const existingSU = await prisma.club.findUnique({
      where: { clubID: 1 },
    });

    if (existingSU) {
      console.log("SU club already exists:", existingSU);
      return;
    }

    // Create SU club
    const suClub = await prisma.club.create({
      data: {
        clubID: 1,
        clubName: "Student Union",
        description:
          "Central Student Union for managing campus-wide activities",
        createdAt: new Date(),
      },
    });

    console.log("SU club created:", suClub);

    // Create default SU roles (optional)
    await prisma.clubRole.createMany({
      data: [{ clubID: 1, roleName: "SU Admin" }],
    });

    console.log("Default SU roles created");
  } catch (error) {
    console.error("Failed to initialize SU club:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

initSUClub();
