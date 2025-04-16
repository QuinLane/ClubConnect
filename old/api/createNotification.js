import { authenticate } from "../utils/authenticate.js";
import { getUserData } from "../utils/getUserData.js";
import { db, admin } from "../utils/firebaseAdmin.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const senderId = await authenticate(req);

    const {
      recipientIds,
      type,
      message,
      senderId: providedSenderId,
      relatedEntity,
    } = req.body;

    const recipients = Array.isArray(recipientIds)
      ? recipientIds
      : [recipientIds];

    if (!recipients.length || !type || !message) {
      return res
        .status(400)
        .json({ error: "recipientIds, type, and message are required" });
    }

    if (providedSenderId && providedSenderId !== senderId) {
      return res.status(403).json({
        error: "Forbidden: Sender ID does not match authenticated user",
      });
    }

    const notificationPromises = recipients.map(async (recipientId) => {
      const recipientData = await getUserData(recipientId);
      if (recipientData instanceof Error || !recipientData) {
        console.warn(
          `Recipient ${recipientId} not found, skipping notification`
        );
        return null;
      }

      // Create the notification directly in Firestore
      const notificationData = {
        recipientId,
        type,
        message,
        senderId: senderId || null,
        relatedEntity: relatedEntity || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
      };

      const notificationRef = await db
        .collection("notifications")
        .add(notificationData);
      return notificationRef.id;
    });

    const notificationIds = (await Promise.all(notificationPromises)).filter(
      (id) => id !== null
    );

    return res.status(200).json({ success: true, notificationIds });
  } catch (error) {
    console.error("Error in function:", error.message);
    const status = error.message.includes("Unauthorized")
      ? 401
      : error.message.includes("User not found")
      ? 404
      : 500;
    return res.status(status).json({ error: error.message });
  }
};
