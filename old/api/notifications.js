import { db } from "../utils/firebaseAdmin.js";
import { authenticate } from "../utils/authenticate.js";
import { getNotificationData } from "../utils/getNotificationData.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await authenticate(req);
    const { action, notificationId } = req.body;

    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ error: "Action is required and must be a string" });
    }

    switch (action) {
      case "markAllNotificationsAsRead": {
        const querySnapshot = await db
          .collection("notifications")
          .where("recipientId", "==", userId)
          .where("isRead", "==", false)
          .get();

        const batch = db.batch();
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, { isRead: true });
        });

        if (batch._ops.length > 0) {
          await batch.commit();
        }

        return res
          .status(200)
          .json({ success: true, updatedCount: batch._ops.length });
      }

      case "deleteNotification": {
        if (!notificationId || typeof notificationId !== "string") {
          return res.status(400).json({
            error: "Notification ID is required and must be a string",
          });
        }

        const notificationData = await getNotificationData(notificationId, res);
        if (
          notificationData instanceof Object &&
          !(notificationData instanceof Error)
        ) {
          if (notificationData.recipientId !== userId) {
            return res.status(403).json({
              error: "You do not have permission to delete this notification",
            });
          }

          await db.collection("notifications").doc(notificationId).delete();

          return res.status(200).json({ success: true });
        }
        return notificationData; // Returns the 404 response from getNotificationData
      }

      case "markNotificationAsRead": {
        if (!notificationId || typeof notificationId !== "string") {
          return res.status(400).json({
            error: "Notification ID is required and must be a string",
          });
        }

        const notificationData = await getNotificationData(notificationId, res);
        if (
          notificationData instanceof Object &&
          !(notificationData instanceof Error)
        ) {
          if (notificationData.recipientId !== userId) {
            return res.status(403).json({
              error:
                "You do not have permission to mark this notification as read",
            });
          }

          await db.collection("notifications").doc(notificationId).update({
            isRead: true,
          });

          return res.status(200).json({ success: true });
        }
        return notificationData; // Returns the 404 response from getNotificationData
      }

      case "deleteAllNotifications": {
        const querySnapshot = await db
          .collection("notifications")
          .where("recipientId", "==", userId)
          .get();

        const batch = db.batch();
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        if (batch._ops.length > 0) {
          await batch.commit();
        }

        return res
          .status(200)
          .json({ success: true, deletedCount: batch._ops.length });
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error("Error in function:", error.message);
    const status = error.message.includes("Unauthorized")
      ? 401
      : error.message.includes("Notification not found")
      ? 404
      : 500;
    return res.status(status).json({ error: error.message });
  }
};
