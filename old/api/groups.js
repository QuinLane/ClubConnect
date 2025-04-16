import { db, admin } from "../utils/firebaseAdmin.js";
import { authenticate } from "../utils/authenticate.js";
import { getUserData } from "../utils/getUserData.js";
import { validateGroupData } from "../utils/validateGroupData.js";
import { checkGroupNameUnique } from "../utils/checkGroupNameUnique.js";
import { checkGroupAdminPermission } from "../utils/checkGroupAdminPermission.js";
import { checkGroupDeletePermission } from "../utils/checkGroupDeletePermission.js";
import { removeGroupFromUsers } from "../utils/removeGroupFromUsers.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await authenticate(req);
    const {
      action,
      groupId,
      updatedGroupDetails,
      groupDetails,
      userId: targetUserId,
    } = req.body;

    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ error: "Action is required and must be a string" });
    }

    const userData = await getUserData(userId); // Used by multiple actions

    // Helper function to fetch group data (used by multiple actions)
    const fetchGroupData = async () => {
      if (!groupId || typeof groupId !== "string") {
        return res
          .status(400)
          .json({ error: "Group ID is required and must be a string" });
      }
      const groupDoc = await db.collection("groups").doc(groupId).get();
      if (!groupDoc.exists) {
        return res.status(404).json({ error: "Group not found" });
      }
      return { id: groupDoc.id, ...groupDoc.data() };
    };

    switch (action) {
      case "editGroupDetails": {
        if (!updatedGroupDetails || typeof updatedGroupDetails !== "object") {
          return res.status(400).json({
            error: "Updated group details are required and must be an object",
          });
        }

        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          const permissionCheck = await checkGroupAdminPermission(
            groupId,
            userId,
            res
          );
          if (permissionCheck !== true) {
            return permissionCheck;
          }

          const allowedFields = ["name", "description"];
          const filteredUpdates = Object.keys(updatedGroupDetails).reduce(
            (acc, key) => {
              if (allowedFields.includes(key)) {
                acc[key] = updatedGroupDetails[key];
              }
              return acc;
            },
            {}
          );

          if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
          }

          const validationError = validateGroupData(filteredUpdates, res);
          if (validationError) {
            return validationError;
          }

          if (
            "name" in filteredUpdates &&
            filteredUpdates.name !== groupData.name
          ) {
            const isNameUnique = await checkGroupNameUnique(
              filteredUpdates.name,
              groupId
            );
            if (!isNameUnique) {
              return res
                .status(400)
                .json({ error: "A group with this name already exists" });
            }
          }

          await db.collection("groups").doc(groupId).update(filteredUpdates);

          const recipients = (groupData.members || []).filter(
            (uid) => uid !== userId
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
                  type: "groupUpdate",
                  message: `${userData.username} updated the group: ${groupData.name}`,
                  senderId: userId,
                  relatedEntity: { type: "group", id: groupId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn("Failed to create notification for group update");
            }
          }

          return res
            .status(200)
            .json({ success: true, updatedFields: filteredUpdates });
        }
        return groupData;
      }

      case "createGroup": {
        if (!groupDetails || typeof groupDetails !== "object") {
          return res.status(400).json({
            error: "Group details are required and must be an object",
          });
        }
        if (groupDetails.ownerId !== userId) {
          return res.status(400).json({
            error: "Owner ID must match the authenticated user's UID",
          });
        }

        const validationError = validateGroupData(groupDetails, res);
        if (validationError) {
          return validationError;
        }

        const isNameUnique = await checkGroupNameUnique(groupDetails.name);
        if (!isNameUnique) {
          return res
            .status(400)
            .json({ error: "A group with this name already exists" });
        }

        const groupData = {
          name: groupDetails.name.trim(),
          description: groupDetails.description || "",
          ownerId: groupDetails.ownerId,
          members: [groupDetails.ownerId],
          admins: [groupDetails.ownerId],
          joinRequests: [],
          CreatedAt: admin.firestore.FieldValue.serverTimestamp(),
          events: [],
        };

        const docRef = await db.collection("groups").add(groupData);

        const chatDetails = {
          members: [groupDetails.ownerId],
          type: "group",
          groupId: docRef.id,
        };
        const chatResponse = await fetch(
          `${process.env.VERCEL_URL || "http://localhost:3000"}/api/chats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization,
            },
            body: JSON.stringify({
              action: "createChat",
              chatDetails,
              chatId: docRef.id,
            }),
          }
        );
        if (!chatResponse.ok) {
          throw new Error("Failed to create associated chat for the group");
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
              recipientIds: [userId],
              type: "groupCreated",
              message: `You created a new group: ${groupData.name}`,
              senderId: userId,
              relatedEntity: { type: "group", id: docRef.id },
            }),
          }
        );

        if (!notificationResponse.ok) {
          console.warn("Failed to create notification for group creation");
        }

        return res.status(200).json({ success: true, groupId: docRef.id });
      }

      case "addGroupAdmin": {
        if (!targetUserId || typeof targetUserId !== "string") {
          return res
            .status(400)
            .json({ error: "User ID is required and must be a string" });
        }

        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          const permissionCheck = await checkGroupAdminPermission(
            groupId,
            userId,
            res
          );
          if (permissionCheck !== true) {
            return permissionCheck;
          }

          if (!groupData.members || !groupData.members.includes(targetUserId)) {
            return res
              .status(400)
              .json({ error: "The target user is not a member of this group" });
          }

          if (groupData.admins && groupData.admins.includes(targetUserId)) {
            return res.status(400).json({
              error: "The target user is already an admin of this group",
            });
          }

          await db
            .collection("groups")
            .doc(groupId)
            .update({
              admins: admin.firestore.FieldValue.arrayUnion(targetUserId),
            });

          const recipients = (groupData.members || []).filter(
            (uid) => uid !== userId
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
                  type:
                    recipientId === targetUserId
                      ? "groupAdminPromoted"
                      : "groupAdminAdded",
                  message:
                    recipientId === targetUserId
                      ? `You were promoted to admin of ${groupData.name} by ${userData.username}`
                      : `${
                          userData.username || "A user"
                        } was promoted to admin in the group: ${
                          groupData.name
                        }`,
                  senderId: userId,
                  relatedEntity: { type: "group", id: groupId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for group admin promotion"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return groupData;
      }

      case "deleteGroup": {
        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          const permissionCheck = await checkGroupDeletePermission(
            groupId,
            userId,
            res
          );
          if (permissionCheck !== true) {
            return permissionCheck;
          }

          const chatResponse = await fetch(
            `${process.env.VERCEL_URL || "http://localhost:3000"}/api/chats`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization,
              },
              body: JSON.stringify({ action: "deleteChat", chatId: groupId }),
            }
          );
          if (!chatResponse.ok) {
            throw new Error("Failed to delete associated chat for the group");
          }

          const recipients = (groupData.members || []).filter(
            (uid) => uid !== userId
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
                  type: "groupDeletion",
                  message: `${userData.username} deleted the group: ${groupData.name}`,
                  senderId: userId,
                  relatedEntity: null,
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn("Failed to create notification for group deletion");
            }
          }

          await removeGroupFromUsers(
            groupId,
            groupData.members,
            groupData.joinRequests
          );

          await db.collection("groups").doc(groupId).delete();

          return res.status(200).json({ success: true });
        }
        return groupData;
      }

      case "acceptGroupJoinRequest": {
        if (!targetUserId || typeof targetUserId !== "string") {
          return res
            .status(400)
            .json({ error: "User ID is required and must be a string" });
        }

        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          const permissionCheck = await checkGroupAdminPermission(
            groupId,
            userId,
            res
          );
          if (permissionCheck !== true) {
            return permissionCheck;
          }

          if (
            !groupData.joinRequests ||
            !groupData.joinRequests.includes(targetUserId)
          ) {
            return res
              .status(400)
              .json({ error: "This user has not requested to join the group" });
          }

          if (groupData.members && groupData.members.includes(targetUserId)) {
            return res
              .status(400)
              .json({ error: "This user is already a member of the group" });
          }

          const groupRef = db.collection("groups").doc(groupId);
          const userRef = db.collection("users").doc(targetUserId);

          await db.runTransaction(async (transaction) => {
            const groupDoc = await transaction.get(groupRef);
            if (!groupDoc.exists) {
              throw new Error("Group not found");
            }
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              throw new Error("User not found");
            }

            transaction.update(groupRef, {
              joinRequests:
                admin.firestore.FieldValue.arrayRemove(targetUserId),
              members: admin.firestore.FieldValue.arrayUnion(targetUserId),
            });

            transaction.update(userRef, {
              groupJoinRequests:
                admin.firestore.FieldValue.arrayRemove(groupId),
              groups: admin.firestore.FieldValue.arrayUnion(groupId),
            });

            const chatResponse = await fetch(
              `${process.env.VERCEL_URL || "http://localhost:3000"}/api/chats`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  action: "addChatMember",
                  chatId: groupId,
                  userId: targetUserId,
                }),
              }
            );
            if (!chatResponse.ok) {
              throw new Error("Failed to add user to the associated chat");
            }
          });

          const recipients = [
            ...(groupData.members || []),
            targetUserId,
          ].filter((uid) => uid !== userId);
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
                  type:
                    recipientId === targetUserId
                      ? "groupJoinAccepted"
                      : "groupMemberJoined",
                  message:
                    recipientId === targetUserId
                      ? `Your request to join ${groupData.name} was approved by ${userData.username}`
                      : `${userData.username || "A user"} joined the group: ${
                          groupData.name
                        }`,
                  senderId: userId,
                  relatedEntity: { type: "group", id: groupId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for group join acceptance"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return groupData;
      }

      case "leaveGroup": {
        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          if (!groupData.members || !groupData.members.includes(userId)) {
            return res
              .status(400)
              .json({ error: "You are not a member of this group" });
          }

          if (groupData.ownerId === userId) {
            return res.status(400).json({
              error:
                "Group owners cannot leave the group. Delete the group instead",
            });
          }

          const groupRef = db.collection("groups").doc(groupId);
          const userRef = db.collection("users").doc(userId);

          await db.runTransaction(async (transaction) => {
            const groupDoc = await transaction.get(groupRef);
            if (!groupDoc.exists) {
              throw new Error("Group not found");
            }

            transaction.update(groupRef, {
              members: admin.firestore.FieldValue.arrayRemove(userId),
              admins: admin.firestore.FieldValue.arrayRemove(userId),
            });

            transaction.update(userRef, {
              groups: admin.firestore.FieldValue.arrayRemove(groupId),
            });

            const chatResponse = await fetch(
              `${process.env.VERCEL_URL || "http://localhost:3000"}/api/chats`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  action: "removeChatMember",
                  chatId: groupId,
                  userId,
                }),
              }
            );
            if (!chatResponse.ok) {
              throw new Error("Failed to remove user from the associated chat");
            }
          });

          const recipients = (groupData.admins || []).filter(
            (uid) => uid !== userId
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
                  type: "groupMemberLeft",
                  message: `${userData.username} left the group: ${groupData.name}`,
                  senderId: userId,
                  relatedEntity: { type: "group", id: groupId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for group member leaving"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return groupData;
      }

      case "getGroupData": {
        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          return res.status(200).json({ groupData });
        }
        return groupData;
      }

      case "removeGroupJoinRequest": {
        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          if (
            !groupData.joinRequests ||
            !groupData.joinRequests.includes(userId)
          ) {
            return res
              .status(400)
              .json({ error: "You have not requested to join this group" });
          }

          const groupRef = db.collection("groups").doc(groupId);
          const userRef = db.collection("users").doc(userId);

          await db.runTransaction(async (transaction) => {
            const groupDoc = await transaction.get(groupRef);
            if (!groupDoc.exists) {
              throw new Error("Group not found");
            }
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              throw new Error("User not found");
            }

            transaction.update(groupRef, {
              joinRequests: admin.firestore.FieldValue.arrayRemove(userId),
            });
            transaction.update(userRef, {
              groupJoinRequests:
                admin.firestore.FieldValue.arrayRemove(groupId),
            });
          });

          const recipients = (groupData.admins || []).filter(
            (uid) => uid !== userId
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
                  type: "groupJoinRequestCancelled",
                  message: `${userData.username} cancelled their request to join your group: ${groupData.name}`,
                  senderId: userId,
                  relatedEntity: { type: "group", id: groupId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for group join request cancellation"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return groupData;
      }

      case "sendGroupJoinRequest": {
        const groupData = await fetchGroupData();
        if (groupData instanceof Object && !(groupData instanceof Error)) {
          if (groupData.members && groupData.members.includes(userId)) {
            return res
              .status(400)
              .json({ error: "You are already a member of this group" });
          }

          if (
            groupData.joinRequests &&
            groupData.joinRequests.includes(userId)
          ) {
            return res
              .status(400)
              .json({ error: "You have already requested to join this group" });
          }

          const groupRef = db.collection("groups").doc(groupId);
          const userRef = db.collection("users").doc(userId);

          await db.runTransaction(async (transaction) => {
            const groupDoc = await transaction.get(groupRef);
            if (!groupDoc.exists) {
              throw new Error("Group not found");
            }
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              throw new Error("User not found");
            }

            transaction.update(groupRef, {
              joinRequests: admin.firestore.FieldValue.arrayUnion(userId),
            });
            transaction.update(userRef, {
              groupJoinRequests: admin.firestore.FieldValue.arrayUnion(groupId),
            });
          });

          const recipients = (groupData.admins || []).filter(
            (uid) => uid !== userId
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
                  type: "groupJoinRequest",
                  message: `${userData.username} requested to join your group: ${groupData.name}`,
                  senderId: userId,
                  relatedEntity: { type: "group", id: groupId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for group join request"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return groupData;
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error("Error in function:", error.message);
    const status = error.message.includes("Unauthorized")
      ? 401
      : error.message.includes("User not found") ||
        error.message.includes("Group not found")
      ? 404
      : 500;
    return res.status(status).json({ error: error.message });
  }
};
