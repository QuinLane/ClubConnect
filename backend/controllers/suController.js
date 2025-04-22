import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllOpenForms = async (req, res) => {
  try {
    const forms = await prisma.form.findMany({
      where: {
        status: "Pending",
      },
      include: {
        club: true,
      },
    });
    res.status(200).json(forms);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch open forms: ${error.message}` });
  }
};

// Note: Available to SU admins
export const getSUStats = async (req, res) => {
  try {
    const openFormsCount = await prisma.form.count({
      where: {status: "Pending" },
    });
    const activeThreadsCount = await prisma.sUMessage.count({
      where: {
        threadID: {
          in: (
            await prisma.sUMessage.findMany({
              where: { isActive: true },
              select: { threadID: true },
            })
          ).map((t) => t.threadID),
        },
      },
    });
    const totalClubsCount = await prisma.club.count({
      where: { clubID: { not: 1 } }, 
    });
    res.status(200).json({
      openFormsCount,
      activeThreadsCount,
      totalClubsCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch SU stats: ${error.message}` });
  }
};

// Note: Available to SU admins
export const getSUActiveThreads = async (req, res) => {
  try {
    const threads = await prisma.sUMessage.groupBy({
      by: ["threadID"],
      where: { isActive: true },
      orderBy: { _max: { sentAt: "desc" } },
    });

    const threadDetails = await Promise.all(
      threads.map(async (thread) => {
        const latestMessage = await prisma.sUMessage.findFirst({
          where: { threadID: thread.threadID },
          include: { sender: true, receiver: true },
          orderBy: { sentAt: "desc" },
        });
        return {
          threadID: thread.threadID,
          latestMessage,
          isActive: true,
        };
      })
    );

    res.status(200).json(threadDetails);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch active SU threads: ${error.message}` });
  }
};
