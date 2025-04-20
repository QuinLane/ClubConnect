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

    // If clubID is provided, ensure the sender is authorized to send on behalf of that club
    if (clubID) {
      if (sender.userType !== "SUAdmin") {
        const isClubAdmin = await prisma.executive.findFirst({
          where: { userID: parseInt(senderID), clubID: parseInt(clubID) },
        });
        if (!isClubAdmin) {
          return res
            .status(403)
            .json({ error: "Not authorized to send on behalf of this club" });
        }
      }
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

    // Get all members of the club (both regular members and executives)
    const members = await prisma.memberOf.findMany({
      where: { clubID: parseInt(clubID) },
      select: { userID: true },
    });

    // Get all executives of the club (in case they're not members)
    const executives = await prisma.executive.findMany({
      where: { clubID: parseInt(clubID) },
      select: { userID: true },
    });

    // Combine and deduplicate recipient IDs
    const allRecipients = [...members, ...executives];
    const uniqueRecipientIDs = [...new Set(allRecipients.map(r => r.userID))];

    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        postedAt: new Date(),
        senderID: parseInt(senderID),
        clubID: parseInt(clubID),
        recipients: {
          create: uniqueRecipientIDs.map(userID => ({
            userID,
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
    const user = await prisma.user.findUnique({
      where: { userID: parseInt(userID) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all clubs where user is an executive
    const executiveClubs = await prisma.executive.findMany({
      where: { userID: parseInt(userID) },
      select: { clubID: true },
    });

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          // Notifications sent directly to this user
          { recipients: { some: { userID: parseInt(userID) } } },
          // Notifications sent to clubs where user is executive
          {
            AND: [
              { clubID: { in: executiveClubs.map(ec => ec.clubID) } },
              { sender: { userType: "SUAdmin" } }, // Only show SUAdmin notifications if user is executive
            ],
          },
        ],
      },
      include: {
        sender: true,
        club: true,
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

// In notificationController.js
export const getClubNotifications = async (req, res) => {
  const { clubID } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        clubID: parseInt(clubID),
      },
      include: {
        sender: true,
        club: true,
      },
      orderBy: { postedAt: "desc" },
    });
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch club notifications: ${error.message}` });
  }
};

export const getExecutiveNotifications = async (req, res) => {
  const { userID } = req.params;
  try {
    // Get all clubs where user is an executive
    const executiveClubs = await prisma.executive.findMany({
      where: { userID: parseInt(userID) },
      select: { clubID: true },
    });

    // Get notifications for these clubs
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          // Notifications sent directly to user
          { recipients: { some: { userID: parseInt(userID) } } },
          // Notifications sent to clubs where user is executive
          { clubID: { in: executiveClubs.map((ec) => ec.clubID) } },
        ],
      },
      include: {
        sender: true,
        club: true,
      },
      orderBy: { postedAt: "desc" },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch executive notifications: ${error.message}`,
    });
  }
};

// In notificationController.js
export const getNotificationsForUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          // Notifications sent to this user
          { recipients: { some: { userID: parseInt(userID) } } },
          // Notifications sent by this user
          { senderID: parseInt(userID) },
        ],
      },
      include: {
        sender: true,
        club: true,
        recipients: true,
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

export const getNotificationsForSender = async (req, res) => {
  const { userID } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          // Notifications sent by this user
          { senderID: parseInt(userID) },
          // Notifications where this user is a recipient
          { recipients: { some: { userID: parseInt(userID) } } },
          // Notifications sent to all users (if user is SUAdmin)
          {
            AND: [
              { recipients: { some: { user: { userType: "SUAdmin" } } } },
              { sender: { userType: "SUAdmin" } },
            ],
          },
        ],
      },
      include: {
        sender: true,
        club: true,
        recipients: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { postedAt: "desc" },
    });

    // Filter out duplicates and format the response
    const uniqueNotifications = notifications.filter(
      (notification, index, self) =>
        index ===
        self.findIndex((n) => n.notificationID === notification.notificationID)
    );

    res.status(200).json(uniqueNotifications);
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch sender notifications: ${error.message}`,
    });
  }
};

export const deleteClubNotifications = async (req, res) => {
  const { clubID } = req.params;

  try {

    // Delete all notifications for this club (Prisma cascades to recipients)
    const deleteResult = await prisma.notification.deleteMany({
      where: { clubID: parseInt(clubID) },
    });

    res.status(200).json({
      message: `Successfully deleted ${deleteResult.count} notifications`,
      count: deleteResult.count,
    });
  } catch (error) {
    res.status(500).json({
      error: `Failed to delete club notifications: ${error.message}`,
    });
  }
};
