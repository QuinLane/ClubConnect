import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Note: Available to students
export const sendSUMessage = async (req, res) => {
  const { userID, content } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { userID: parseInt(userID) },
    });
    if (!user || user.userType !== "Student") {
      return res
        .status(403)
        .json({ error: "Only students can send messages to SU" });
    }

    // Check for any active thread involving the user
    const activeThread = await prisma.sUMessage.findFirst({
      where: {
        OR: [
          { senderID: parseInt(userID), receiverID: null, isActive: true },
          { receiverID: parseInt(userID), senderID: null, isActive: true },
        ],
      },
      select: { threadID: true },
    });

    // If an active thread exists, reuse its threadID
    let threadID;
    if (activeThread) {
      threadID = activeThread.threadID;
    } else {
      // Create a new threadID (increment based on total messages)
      threadID = (await prisma.sUMessage.count()) + 1;
    }

    const message = await prisma.sUMessage.create({
      data: {
        senderID: parseInt(userID),
        receiverID: null,
        content,
        sentAt: new Date(),
        isRead: false,
        isActive: true,
        threadID,
      },
      include: { sender: true, receiver: true },
    });

    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to send SU message: ${error.message}` });
  }
};

// Note: Available to SU admins
export const replyToSUMessage = async (req, res) => {
  const { threadID, content, suAdminID } = req.body;
  try {
    const suAdmin = await prisma.user.findUnique({
      where: { userID: parseInt(suAdminID) },
    });
    if (!suAdmin || suAdmin.userType !== "SUAdmin") {
      return res.status(403).json({ error: "Only SU admins can reply" });
    }

    const threadExists = await prisma.sUMessage.findFirst({
      where: { threadID: parseInt(threadID), isActive: true },
    });
    if (!threadExists) {
      return res.status(404).json({ error: "Thread not found or resolved" });
    }

    const studentMessage = await prisma.sUMessage.findFirst({
      where: { threadID: parseInt(threadID), senderID: { not: null } },
    });
    if (!studentMessage) {
      return res.status(400).json({ error: "No student found in thread" });
    }

    const message = await prisma.sUMessage.create({
      data: {
        senderID: null,
        receiverID: studentMessage.senderID,
        content,
        sentAt: new Date(),
        isRead: false,
        isActive: true,
        threadID: parseInt(threadID),
      },
      include: { sender: true, receiver: true },
    });

    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to reply to SU message: ${error.message}` });
  }
};

// Note: Available to students or SU admins
export const getSUThread = async (req, res) => {
  const { threadID, userID } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userID: parseInt(userID) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const threadMessage = await prisma.sUMessage.findFirst({
      where: {
        threadID: parseInt(threadID),
        OR: [
          { senderID: parseInt(userID) },
          { receiverID: parseInt(userID) },
          { senderID: null, AND: { userType: "SUAdmin" } },
        ],
      },
    });

    if (!threadMessage) {
      return res
        .status(403)
        .json({ error: "User not authorized to view thread" });
    }

    const messages = await prisma.sUMessage.findMany({
      where: { threadID: parseInt(threadID) },
      include: { sender: true, receiver: true },
      orderBy: { sentAt: "asc" },
    });

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch SU thread: ${error.message}` });
  }
};

// Note: Available to students
export const getSUThreads = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userID: parseInt(userID) },
    });
    if (!user || user.userType !== "Student") {
      return res
        .status(403)
        .json({ error: "Only students can view their threads" });
    }

    const threads = await prisma.sUMessage.groupBy({
      by: ["threadID"],
      where: {
        OR: [{ senderID: parseInt(userID) }, { receiverID: parseInt(userID) }],
        isActive: true,
      },
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
      .json({ error: `Failed to fetch SU threads: ${error.message}` });
  }
};

// Note: Available to students or SU admins
export const markSUMessageRead = async (req, res) => {
  const { messageID, userID } = req.params;
  try {
    const message = await prisma.sUMessage.findUnique({
      where: { messageID: parseInt(messageID) },
      include: { sender: true, receiver: true },
    });
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const user = await prisma.user.findUnique({
      where: { userID: parseInt(userID) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      (user.userType === "Student" &&
        message.receiverID === parseInt(userID)) ||
      (user.userType === "SUAdmin" && message.senderID !== null)
    ) {
      await prisma.sUMessage.update({
        where: { messageID: parseInt(messageID) },
        data: { isRead: true },
      });
      res.status(200).json({ message: "Message marked as read" });
    } else {
      res.status(403).json({ error: "Not authorized to mark message as read" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to mark message as read: ${error.message}` });
  }
};

// Note: Available to SU admins
export const resolveSUThread = async (req, res) => {
  const { threadID, suAdminID } = req.body;
  try {
    const suAdmin = await prisma.user.findUnique({
      where: { userID: parseInt(suAdminID) },
    });
    if (!suAdmin || suAdmin.userType !== "SUAdmin") {
      return res
        .status(403)
        .json({ error: "Only SU admins can resolve threads" });
    }

    const threadExists = await prisma.sUMessage.findFirst({
      where: { threadID: parseInt(threadID) },
    });
    if (!threadExists) {
      return res.status(404).json({ error: "Thread not found" });
    }

    await prisma.sUMessage.updateMany({
      where: { threadID: parseInt(threadID) },
      data: { isActive: false },
    });

    res.status(200).json({ message: "Thread resolved" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to resolve SU thread: ${error.message}` });
  }
};
