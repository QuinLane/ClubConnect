import { db, admin } from "../utils/firebaseAdmin.js";
import { authenticate } from "../utils/authenticate.js";
import { getUserData } from "../utils/getUserData.js";
import { getGroupData } from "../utils/getGroupData.js";
import { validateSuggestionData } from "../utils/validateSuggestionData.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await authenticate(req);
    const { action, suggestionId } = req.body;

    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ error: "Action is required and must be a string" });
    }

    switch (action) {
      case "removeSuggestions": {
        if (!suggestionId || typeof suggestionId !== "string") {
          return res
            .status(400)
            .json({ error: "Suggestion ID is required and must be a string" });
        }

        const userData = await getUserData(userId);
        const suggestionDoc = await db
          .collection("suggestedFriends")
          .doc(suggestionId)
          .get();
        if (!suggestionDoc.exists) {
          return res.status(404).json({ error: "Suggestion not found" });
        }
        const suggestionData = {
          id: suggestionDoc.id,
          ...suggestionDoc.data(),
        };

        if (suggestionData.userId !== userId) {
          return res.status(403).json({
            error: "You do not have permission to remove this suggestion",
          });
        }

        await db.collection("suggestedFriends").doc(suggestionId).delete();

        // Call the /api/createNotification endpoint
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
              type: "suggestionRemoved",
              message: "You removed a friend suggestion",
              senderId: userId,
              relatedEntity: null,
            }),
          }
        );

        if (!notificationResponse.ok) {
          console.warn("Failed to create notification for suggestion removal");
        }

        return res.status(200).json({ success: true });
      }

      case "getUserSuggestions": {
        const suggestionsSnapshot = await db
          .collection("suggestedFriends")
          .where("userId", "==", userId)
          .get();

        const suggestions = suggestionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return res.status(200).json({ suggestions });
      }

      case "generateSuggestions": {
        const userData = await getUserData(userId);

        const usersSnapshot = await db.collection("users").get();
        const allUsers = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.id !== userId);

        const suggestions = [];
        for (const otherUser of allUsers) {
          if (
            userData.friends?.includes(otherUser.id) ||
            userData.friendRequests?.includes(otherUser.id) ||
            userData.friendRequestsSent?.includes(otherUser.id)
          ) {
            continue;
          }

          const sharedCourses = userData.courses?.filter((course) =>
            otherUser.courses?.includes(course)
          );
          if (sharedCourses?.length > 0) {
            suggestions.push({
              userId,
              suggestedUserId: otherUser.id,
              reason: `Shared course: ${sharedCourses[0]}`,
            });
            continue;
          }

          const sharedInterests = userData.interests?.filter((interest) =>
            otherUser.interests?.includes(interest)
          );
          if (sharedInterests?.length > 0) {
            suggestions.push({
              userId,
              suggestedUserId: otherUser.id,
              reason: `Shared interest: ${sharedInterests[0]}`,
            });
            continue;
          }

          const sharedGroups = userData.groups?.filter((groupId) =>
            otherUser.groups?.includes(groupId)
          );
          if (sharedGroups?.length > 0) {
            const groupData = await getGroupData(sharedGroups[0]);
            if (groupData instanceof Object && !(groupData instanceof Error)) {
              const groupName = groupData.name || "Unknown Group";
              suggestions.push({
                userId,
                suggestedUserId: otherUser.id,
                reason: `Shared group: ${groupName}`,
              });
            }
          }
        }

        const batch = db.batch();
        const suggestionPromises = suggestions
          .slice(0, 10)
          .map((suggestion) => {
            const suggestionData = {
              userId: suggestion.userId,
              suggestedUserId: suggestion.suggestedUserId,
              reason: suggestion.reason,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            const validationError = validateSuggestionData(suggestionData, res);
            if (validationError) {
              throw validationError;
            }
            const suggestionRef = db.collection("suggestedFriends").doc();
            batch.set(suggestionRef, suggestionData);
            return suggestionRef.id;
          });

        if (batch._ops.length > 0) {
          await batch.commit();
        }

        if (suggestionPromises.length > 0) {
          // Call the /api/createNotification endpoint
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
                type: "newSuggestions",
                message: `You have ${suggestionPromises.length} new friend suggestions`,
                senderId: userId,
                relatedEntity: null,
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for new suggestions");
          }
        }

        return res
          .status(200)
          .json({ success: true, suggestionCount: suggestionPromises.length });
      }

      case "getSuggestionData": {
        if (!suggestionId || typeof suggestionId !== "string") {
          return res
            .status(400)
            .json({ error: "Suggestion ID is required and must be a string" });
        }

        const suggestionDoc = await db
          .collection("suggestedFriends")
          .doc(suggestionId)
          .get();
        if (!suggestionDoc.exists) {
          return res.status(404).json({ error: "Suggestion not found" });
        }

        const suggestionData = {
          id: suggestionDoc.id,
          ...suggestionDoc.data(),
        };

        if (suggestionData.userId !== userId) {
          return res.status(403).json({
            error: "You do not have permission to view this suggestion",
          });
        }

        return res.status(200).json({ suggestionData });
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error("Error in function:", error.message);
    const status = error.message.includes("Unauthorized")
      ? 401
      : error.message.includes("User not found") ||
        error.message.includes("Suggestion not found") ||
        error.message.includes("Group not found")
      ? 404
      : error.status || 500;
    return res.status(status).json({ error: error.message });
  }
};
