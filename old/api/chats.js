import { db, admin } from "../utils/firebaseAdmin.js";
import { authenticate } from "../utils/authenticate.js";
import { getUserData } from "../utils/getUserData.js";
import { getGroupData } from "../utils/getGroupData.js";
import { validateChatDetails } from "../utils/validateChatDetails.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await authenticate(req);
    const {
      action,
      chatId,
      content,
      userId: targetUserId,
      chatDetails,
    } = req.body;

    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ error: "Action is required and must be a string" });
    }

    const userData = await getUserData(userId); // Used by multiple actions

    // Helper function to fetch chat data (used by multiple actions)
    const fetchChatData = async () => {
      if (!chatId || typeof chatId !== "string") {
        return res
          .status(400)
          .json({ error: "Chat ID is required and must be a string" });
      }
      const chatDoc = await db.collection("chats").doc(chatId).get();
      if (!chatDoc.exists) {
        return res.status(404).json({ error: "Chat not found" });
      }
      const chatData = { id: chatDoc.id, ...chatDoc.data() };
      if (!chatData.members.includes(userId)) {
        return res
          .status(403)
          .json({ error: "You are not a member of this chat" });
      }
      return chatData;
    };

    switch (action) {
      case "createChat": {
        if (!chatId || typeof chatId !== "string") {
          return res
            .status(400)
            .json({ error: "Chat ID is required and must be a string" });
        }

        const validationError = validateChatDetails(chatDetails, res);
        if (validationError) {
          return validationError;
        }

        if (!chatDetails.members.includes(userId)) {
          return res
            .status(403)
            .json({ error: "You must be a member to create this chat" });
        }

        const chatData = {
          members: chatDetails.members,
          type: chatDetails.type,
          groupId: chatDetails.groupId || null,
          lastMessage: "",
          lastMessageTimestamp: null,
        };

        await db.collection("chats").doc(chatId).set(chatData);

        const recipients = chatDetails.members.filter((uid) => uid !== userId);
        for (const recipientId of recipients) {
          const notificationResponse = await fetch(
            `${
              process.env.VERCEL_URL || "http://localhost:3000"
            }/api/createNotification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization,
              },
              body: JSON.stringify({
                recipientIds: [recipientId],
                type: "chatCreated",
                message: `${userData.username} started a new ${chatDetails.type} chat`,
                senderId: userId,
                relatedEntity: { type: "chat", id: chatId },
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for chat creation");
          }
        }

        return res.status(200).json({ success: true, chatId });
      }

      case "deleteChat": {
        const chatData = await fetchChatData();
        if (chatData instanceof Object && !(chatData instanceof Error)) {
          const subcollections = ["messages", "lastRead"];
          for (const subcollectionName of subcollections) {
            const subcollectionRef = db
              .collection("chats")
              .doc(chatId)
              .collection(subcollectionName);
            const subcollectionDocs = await subcollectionRef.get();
            const batch = db.batch();
            subcollectionDocs.forEach((doc) => {
              batch.delete(doc.ref);
            });
            if (batch._ops.length > 0) {
              await batch.commit();
            }
          }

          const recipients = chatData.members.filter((uid) => uid !== userId);
          for (const recipientId of recipients) {
            const notificationResponse = await fetch(
              `${
                process.env.VERCEL_URL || "http://localhost:3000"
              }/api/createNotification`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  recipientIds: [recipientId],
                  type: "chatDeleted",
                  message: `${userData.username} deleted the ${chatData.type} chat`,
                  senderId: userId,
                  relatedEntity: null,
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn("Failed to create notification for chat deletion");
            }
          }

          await db.collection("chats").doc(chatId).delete();

          return res.status(200).json({ success: true });
        }
        return chatData; // Returns the 404 response
      }

      case "getChatData": {
        const chatData = await fetchChatData();
        if (chatData instanceof Object && !(chatData instanceof Error)) {
          return res.status(200).json({ chatData });
        }
        return chatData; // Returns the 404 response
      }

      case "addChatMember": {
        if (!targetUserId || typeof targetUserId !== "string") {
          return res
            .status(400)
            .json({ error: "User ID is required and must be a string" });
        }

        const chatData = await fetchChatData();
        if (chatData instanceof Object && !(chatData instanceof Error)) {
          if (chatData.members.includes(targetUserId)) {
            return res
              .status(400)
              .json({ error: "User is already a member of this chat" });
          }

          if (chatData.type === "group" && chatData.groupId) {
            const groupData = await getGroupData(chatData.groupId, res);
            if (groupData instanceof Object && !(groupData instanceof Error)) {
              if (!groupData.members.includes(targetUserId)) {
                return res.status(400).json({
                  error: "User is not a member of the associated group",
                });
              }
            } else {
              return groupData;
            }
          }

          await db
            .collection("chats")
            .doc(chatId)
            .update({
              members: admin.firestore.FieldValue.arrayUnion(targetUserId),
            });

          const recipients = chatData.members.filter((uid) => uid !== userId);
          for (const recipientId of recipients) {
            const notificationResponse = await fetch(
              `${
                process.env.VERCEL_URL || "http://localhost:3000"
              }/api/createNotification`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  recipientIds: [recipientId],
                  type: "chatMemberAdded",
                  message: `${userData.username} added a new member to the ${chatData.type} chat`,
                  senderId: userId,
                  relatedEntity: { type: "chat", id: chatId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for chat member addition"
              );
            }
          }

          const notificationResponse = await fetch(
            `${
              process.env.VERCEL_URL || "http://localhost:3000"
            }/api/createNotification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization,
              },
              body: JSON.stringify({
                recipientIds: [targetUserId],
                type: "chatJoined",
                message: `You were added to a ${chatData.type} chat by ${userData.username}`,
                senderId: userId,
                relatedEntity: { type: "chat", id: chatId },
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for chat join");
          }

          return res.status(200).json({ success: true });
        }
        return chatData;
      }

      case "removeChatMember": {
        if (!targetUserId || typeof targetUserId !== "string") {
          return res
            .status(400)
            .json({ error: "User ID is required and must be a string" });
        }

        const chatData = await fetchChatData();
        if (chatData instanceof Object && !(chatData instanceof Error)) {
          if (!chatData.members.includes(userId) && userId !== targetUserId) {
            return res.status(403).json({
              error:
                "You must be a member to remove others from this chat, unless you are removing yourself",
            });
          }

          if (!chatData.members.includes(targetUserId)) {
            return res
              .status(400)
              .json({ error: "User is not a member of this chat" });
          }

          if (chatData.type === "private") {
            return res.status(400).json({
              error:
                "Cannot remove members from a private chat. Delete the chat instead",
            });
          }

          await db
            .collection("chats")
            .doc(chatId)
            .update({
              members: admin.firestore.FieldValue.arrayRemove(targetUserId),
            });

          await db
            .collection("chats")
            .doc(chatId)
            .collection("lastRead")
            .doc(targetUserId)
            .delete();

          const recipients = chatData.members.filter(
            (uid) => uid !== targetUserId && uid !== userId
          );
          for (const recipientId of recipients) {
            const notificationResponse = await fetch(
              `${
                process.env.VERCEL_URL || "http://localhost:3000"
              }/api/createNotification`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  recipientIds: [recipientId],
                  type: "chatMemberRemoved",
                  message: `${userData.username} removed a member from the ${chatData.type} chat`,
                  senderId: userId,
                  relatedEntity: { type: "chat", id: chatId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for chat member removal"
              );
            }
          }

          const notificationResponse = await fetch(
            `${
              process.env.VERCEL_URL || "http://localhost:3000"
            }/api/createNotification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization,
              },
              body: JSON.stringify({
                recipientIds: [targetUserId],
                type: "chatLeft",
                message: `You were removed from a ${chatData.type} chat by ${userData.username}`,
                senderId: userId,
                relatedEntity: { type: "chat", id: chatId },
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for chat leave");
          }

          return res.status(200).json({ success: true });
        }
        return chatData;
      }

      case "sendMessage": {
        if (!content || typeof content !== "string" || content.trim() === "") {
          return res.status(400).json({
            error: "Message content is required and must be a non-empty string",
          });
        }

        const chatData = await fetchChatData();
        if (chatData instanceof Object && !(chatData instanceof Error)) {
          if (chatData.type === "group" && chatData.groupId) {
            const groupData = await getGroupData(chatData.groupId, res);
            if (groupData instanceof Object && !(groupData instanceof Error)) {
              if (!groupData.members.includes(userId)) {
                return res.status(403).json({
                  error: "You are not a member of the associated group",
                });
              }
            } else {
              return groupData;
            }
          }

          const trimmedContent = content.trim();

          await db.collection("chats").doc(chatId).collection("messages").add({
            senderId: userId,
            content: trimmedContent,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });

          await db.collection("chats").doc(chatId).update({
            lastMessage: trimmedContent,
            lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          });

          const recipients = chatData.members.filter((uid) => uid !== userId);
          for (const recipientId of recipients) {
            const notificationResponse = await fetch(
              `${
                process.env.VERCEL_URL || "http://localhost:3000"
              }/api/createNotification`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  recipientIds: [recipientId],
                  type: "newChatMessage",
                  message: `${userData.username} sent a message in the ${chatData.type} chat: ${trimmedContent}`,
                  senderId: userId,
                  relatedEntity: { type: "chat", id: chatId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for new chat message"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return chatData;
      }

      case "updateLastRead": {
        const chatData = await fetchChatData();
        if (chatData instanceof Object && !(chatData instanceof Error)) {
          await db
            .collection("chats")
            .doc(chatId)
            .collection("lastRead")
            .doc(userId)
            .set({
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

          return res.status(200).json({ success: true });
        }
        return chatData;
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error("Error in function:", error.message);
    const status = error.message.includes("Unauthorized")
      ? 401
      : error.message.includes("User not found") ||
        error.message.includes("Chat not found") ||
        error.message.includes("Group not found")
      ? 404
      : 500;
    return res.status(status).json({ error: error.message });
  }
};
