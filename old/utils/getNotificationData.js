import { db } from "./firebaseAdmin.js";

const getNotificationData = async (notificationId, res) => {
  const notificationDoc = await db
    .collection("notifications")
    .doc(notificationId)
    .get();

  if (!notificationDoc.exists) {
    if (res) {
      return res.status(404).json({ error: "Notification not found" });
    }
    throw new Error("Notification not found");
  }

  return notificationDoc.data();
};

export { getNotificationData };
