import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Note: Available to SU admins or club admins
export const createNotification = async (req, res) => {
  const { title, content, senderID, clubID, recipientIDs } = req.body;
  try {
    const sender = await prisma.user.findUnique({
      where: { userID: parseInt(senderID) },
    });
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        postedAt: new Date(),
        senderID: parseInt(senderID),
        clubID: clubID ? parseInt(clubID) : null,
        recipients: {
          create: recipientIDs.map((userID) => ({
            userID: parseInt(userID),
            isRead: false,
          })),
        },
      },
      include: {
        sender: true,
        club: true,
        recipients: { include: { user: true } },
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create notification: ${error.message}` });
  }
};

// Note: Available to SU admins
export const sendNotificationToAll = async (req, res) => {
  const { title, content, senderID } = req.body;
  try {
    const sender = await prisma.user.findUnique({
      where: { userID: parseInt(senderID) },
    });
    if (!sender || sender.userType !== "SUAdmin") {
      return res.status(403).json({ error: "Only SU admins can send to all" });
    }

    const users = await prisma.user.findMany({
      where: { userType: "Student" },
      select: { userID: true },
    });

    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        postedAt: new Date(),
        senderID: parseInt(senderID),
        recipients: {
          create: users.map((user) => ({
            userID: user.userID,
            isRead: false,
          })),
        },
      },
      include: {
        sender: true,
        club: true,
        recipients: { include: { user: true } },
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to send notification to all: ${error.message}` });
  }
};

// Note: Available to SU admins or club admins
export const sendNotificationToClub = async (req, res) => {
  const { title, content, senderID, clubID } = req.body;
  try {
    const sender = await prisma.user.findUnique({
      where: { userID: parseInt(senderID) },
    });
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // Check if sender is SU admin or club admin
    if (sender.userType !== "SUAdmin") {
      const isClubAdmin = await prisma.executive.findFirst({
        where: { userID: parseInt(senderID), clubID: parseInt(clubID) },
      });
      if (!isClubAdmin) {
        return res
          .status(403)
          .json({ error: "Not authorized to send to this club" });
      }
    }

    const members = await prisma.memberOf.findMany({
      where: { clubID: parseInt(clubID) },
      select: { userID: true },
    });

    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        postedAt: new Date(),
        senderID: parseInt(senderID),
        clubID: parseInt(clubID),
        recipients: {
          create: members.map((member) => ({
            userID: member.userID,
            isRead: false,
          })),
        },
      },
      include: {
        sender: true,
        club: true,
        recipients: { include: { user: true } },
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to send notification to club: ${error.message}` });
  }
};

// Note: Available to authenticated users
export const getUserNotifications = async (req, res) => {
  const { userID } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipients: {
          some: { userID: parseInt(userID) },
        },
      },
      include: {
        sender: true,
        club: true,
        recipients: { include: { user: true } },
      },
      orderBy: { postedAt: "desc" },
    });
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user notifications: ${error.message}` });
  }
};

// Note: Available to authenticated users
export const markNotificationRead = async (req, res) => {
  const { notificationID, userID } = req.params;
  try {
    const recipient = await prisma.notificationRecipient.update({
      where: {
        notificationID_userID: {
          notificationID: parseInt(notificationID),
          userID: parseInt(userID),
        },
      },
      data: { isRead: true },
    });
    res.status(200).json(recipient);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to mark notification as read: ${error.message}` });
  }
};
