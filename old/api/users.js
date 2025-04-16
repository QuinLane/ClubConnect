import { db, admin, storage } from "../utils/firebaseAdmin.js";
import { authenticate } from "../utils/authenticate.js";
import { validateUserData } from "../utils/validateUserData.js";
import { checkUsernameUnique } from "../utils/checkUsernameUnique.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await authenticate(req);
    const {
      action,
      userIdToBlock,
      userIdToUnblock,
      username,
      courses,
      bio,
      interests,
      year,
      role,
      profilePhoto,
      recipientId,
      suggestionId,
      requesterId,
      friendId,
      updatedUserData,
      fileBase64,
      fileName,
    } = req.body;

    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ error: "Action is required and must be a string" });
    }

    // Helper function to fetch user data (used by multiple actions)
    const fetchUserData = async (targetUserId, actionName) => {
      if (!targetUserId || typeof targetUserId !== "string") {
        return res
          .status(400)
          .json({ error: `${actionName} ID is required and must be a string` });
      }
      const userDoc = await db.collection("users").doc(targetUserId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      return { id: userDoc.id, ...userDoc.data() };
    };

    switch (action) {
      case "blockUser": {
        if (!userIdToBlock || typeof userIdToBlock !== "string") {
          return res.status(400).json({
            error: "User ID to block is required and must be a string",
          });
        }
        if (userId === userIdToBlock) {
          return res.status(400).json({ error: "Cannot block yourself" });
        }

        const userData = await fetchUserData(userId, "User");
        const recipientData = await fetchUserData(userIdToBlock, "Recipient");
        if (userData instanceof Object && recipientData instanceof Object) {
          if (userData.blockedUsers?.includes(userIdToBlock)) {
            return res.status(400).json({ error: "User is already blocked" });
          }

          await db
            .collection("users")
            .doc(userId)
            .update({
              blockedUsers:
                admin.firestore.FieldValue.arrayUnion(userIdToBlock),
            });

          if (userData.friends?.includes(userIdToBlock)) {
            await Promise.all([
              db
                .collection("users")
                .doc(userId)
                .update({
                  friends:
                    admin.firestore.FieldValue.arrayRemove(userIdToBlock),
                }),
              db
                .collection("users")
                .doc(userIdToBlock)
                .update({
                  friends: admin.firestore.FieldValue.arrayRemove(userId),
                }),
            ]);
          }

          if (userData.friendRequests?.includes(userIdToBlock)) {
            await Promise.all([
              db
                .collection("users")
                .doc(userId)
                .update({
                  friendRequests:
                    admin.firestore.FieldValue.arrayRemove(userIdToBlock),
                }),
              db
                .collection("users")
                .doc(userIdToBlock)
                .update({
                  friendRequestsSent:
                    admin.firestore.FieldValue.arrayRemove(userId),
                }),
            ]);
          }
          if (userData.friendRequestsSent?.includes(userIdToBlock)) {
            await Promise.all([
              db
                .collection("users")
                .doc(userId)
                .update({
                  friendRequestsSent:
                    admin.firestore.FieldValue.arrayRemove(userIdToBlock),
                }),
              db
                .collection("users")
                .doc(userIdToBlock)
                .update({
                  friendRequests:
                    admin.firestore.FieldValue.arrayRemove(userId),
                }),
            ]);
          }

          return res.status(200).json({ success: true });
        }
        return userData instanceof Object ? recipientData : userData;
      }

      case "unblockUser": {
        if (!userIdToUnblock || typeof userIdToUnblock !== "string") {
          return res.status(400).json({
            error: "User ID to unblock is required and must be a string",
          });
        }

        const userData = await fetchUserData(userId, "User");
        if (userData instanceof Object) {
          if (!userData.blockedUsers?.includes(userIdToUnblock)) {
            return res.status(400).json({ error: "User is not blocked" });
          }

          await db
            .collection("users")
            .doc(userId)
            .update({
              blockedUsers:
                admin.firestore.FieldValue.arrayRemove(userIdToUnblock),
            });

          return res.status(200).json({ success: true });
        }
        return userData;
      }

      case "createUser": {
        if (!userId || typeof userId !== "string") {
          return res
            .status(400)
            .json({ error: "UID is required and must be a string" });
        }

        const userData = {
          username: username?.trim(),
          bio: bio || "",
          courses: courses || [],
          interests: interests || [],
          year: year || "",
          role: role || "student",
          profilePhoto: profilePhoto || "",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          friends: [],
          friendRequests: [],
          friendRequestsSent: [],
          settings: {
            notifications: { email: true, push: true },
            privacy: "everyone",
            theme: "light",
          },
          groups: [],
          groupJoinRequests: [],
          privateChats: [],
          eventsAttending: [],
          blockedUsers: [],
        };

        const validationError = validateUserData(userData, false, res);
        if (validationError) {
          return validationError;
        }

        const usernameCheck = await checkUsernameUnique(
          userData.username,
          null,
          res
        );
        if (usernameCheck !== true) {
          return usernameCheck;
        }

        await db.collection("users").doc(userId).set(userData);

        return res.status(200).json({ success: true });
      }

      case "sendFriendRequest": {
        if (!recipientId || typeof recipientId !== "string") {
          return res
            .status(400)
            .json({ error: "Recipient ID is required and must be a string" });
        }
        if (userId === recipientId) {
          return res
            .status(400)
            .json({ error: "Cannot send a friend request to yourself" });
        }

        const senderData = await fetchUserData(userId, "Sender");
        const recipientData = await fetchUserData(recipientId, "Recipient");
        if (senderData instanceof Object && recipientData instanceof Object) {
          if (senderData.blockedUsers?.includes(recipientId)) {
            return res.status(403).json({
              error:
                "You have blocked this user and cannot send a friend request",
            });
          }
          if (recipientData.blockedUsers?.includes(userId)) {
            return res.status(403).json({
              error:
                "This user has blocked you and cannot receive your friend request",
            });
          }

          if (senderData.friends?.includes(recipientId)) {
            return res
              .status(400)
              .json({ error: "You are already friends with this user" });
          }

          if (senderData.friendRequestsSent?.includes(recipientId)) {
            return res.status(400).json({
              error: "You have already sent a friend request to this user",
            });
          }
          if (recipientData.friendRequests?.includes(userId)) {
            return res.status(400).json({
              error: "A friend request from this user already exists",
            });
          }

          await Promise.all([
            db
              .collection("users")
              .doc(recipientId)
              .update({
                friendRequests: admin.firestore.FieldValue.arrayUnion(userId),
              }),
            db
              .collection("users")
              .doc(userId)
              .update({
                friendRequestsSent:
                  admin.firestore.FieldValue.arrayUnion(recipientId),
              }),
          ]);

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
                recipientIds: [recipientId],
                type: "friendRequest",
                message: `${senderData.username} sent you a friend request`,
                senderId: userId,
                relatedEntity: null,
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for friend request");
          }

          if (suggestionId) {
            const suggestionResponse = await fetch(
              `${
                process.env.VERCEL_URL || "http://localhost:3000"
              }/api/suggestedFriends`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: req.headers.authorization,
                },
                body: JSON.stringify({
                  action: "removeSuggestions",
                  suggestionId,
                }),
              }
            );
            if (!suggestionResponse.ok) {
              console.warn("Failed to remove suggestion:", suggestionId);
            }
          }

          return res.status(200).json({ success: true });
        }
        return senderData instanceof Object ? recipientData : senderData;
      }

      case "deleteUserAccount": {
        const userData = await fetchUserData(userId, "User");
        if (userData instanceof Object) {
          const friendUpdates =
            userData.friends?.map(async (friendId) => {
              await db
                .collection("users")
                .doc(friendId)
                .update({
                  friends: admin.firestore.FieldValue.arrayRemove(userId),
                });
            }) || [];
          await Promise.all(friendUpdates);

          const friendRequestUpdates =
            userData.friendRequests?.map(async (requesterId) => {
              await db
                .collection("users")
                .doc(requesterId)
                .update({
                  friendRequestsSent:
                    admin.firestore.FieldValue.arrayRemove(userId),
                });
            }) || [];
          await Promise.all(friendRequestUpdates);

          const friendRequestSentUpdates =
            userData.friendRequestsSent?.map(async (recipientId) => {
              await db
                .collection("users")
                .doc(recipientId)
                .update({
                  friendRequests:
                    admin.firestore.FieldValue.arrayRemove(userId),
                });
            }) || [];
          await Promise.all(friendRequestSentUpdates);

          const groupUpdates =
            userData.groups?.map(async (groupId) => {
              await db
                .collection("groups")
                .doc(groupId)
                .update({
                  members: admin.firestore.FieldValue.arrayRemove(userId),
                  admins: admin.firestore.FieldValue.arrayRemove(userId),
                });
            }) || [];
          await Promise.all(groupUpdates);

          const groupJoinRequestUpdates =
            userData.groupJoinRequests?.map(async (groupId) => {
              await db
                .collection("groups")
                .doc(groupId)
                .update({
                  joinRequests: admin.firestore.FieldValue.arrayRemove(userId),
                });
            }) || [];
          await Promise.all(groupJoinRequestUpdates);

          const eventUpdates =
            userData.eventsAttending?.map(async (eventId) => {
              await db
                .collection("events")
                .doc(eventId)
                .update({
                  attendees: admin.firestore.FieldValue.arrayRemove(userId),
                });
            }) || [];
          await Promise.all(eventUpdates);

          const chatUpdates =
            userData.privateChats?.map(async (chatId) => {
              await db.collection("chats").doc(chatId).delete();
            }) || [];
          await Promise.all(chatUpdates);

          const suggestionsQuery = await db
            .collection("suggestedFriends")
            .where("userId", "==", userId)
            .get();
          const suggestionDeletes = suggestionsQuery.docs.map(async (doc) => {
            await doc.ref.delete();
          });
          await Promise.all(suggestionDeletes);

          const suggestedToQuery = await db
            .collection("suggestedFriends")
            .where("suggestedUserId", "==", userId)
            .get();
          const suggestedToDeletes = suggestedToQuery.docs.map(async (doc) => {
            await doc.ref.delete();
          });
          await Promise.all(suggestedToDeletes);

          const blockedByQuery = await db
            .collection("users")
            .where("blockedUsers", "array-contains", userId)
            .get();
          const blockedByUpdates = blockedByQuery.docs.map(async (doc) => {
            await doc.ref.update({
              blockedUsers: admin.firestore.FieldValue.arrayRemove(userId),
            });
          });
          await Promise.all(blockedByUpdates);

          if (userData.profilePhoto) {
            try {
              const photoRef = storage.bucket().file(userData.profilePhoto);
              await photoRef.delete();
              console.log(
                "Profile photo deleted from storage:",
                userData.profilePhoto
              );
            } catch (storageError) {
              console.warn(
                "Could not delete profile photo from storage:",
                storageError.message
              );
            }
          }

          await db.collection("users").doc(userId).delete();

          return res.status(200).json({
            success: true,
            message:
              "Cleanup completed. Please call deleteUser on the client to remove the Firebase Auth user.",
          });
        }
        return userData;
      }

      case "removeFriendRequest": {
        if (!recipientId || typeof recipientId !== "string") {
          return res
            .status(400)
            .json({ error: "Recipient ID is required and must be a string" });
        }

        const senderData = await fetchUserData(userId, "Sender");
        if (senderData instanceof Object) {
          if (!senderData.friendRequestsSent?.includes(recipientId)) {
            return res
              .status(400)
              .json({ error: "No friend request found to remove" });
          }

          await Promise.all([
            db
              .collection("users")
              .doc(recipientId)
              .update({
                friendRequests: admin.firestore.FieldValue.arrayRemove(userId),
              }),
            db
              .collection("users")
              .doc(userId)
              .update({
                friendRequestsSent:
                  admin.firestore.FieldValue.arrayRemove(recipientId),
              }),
          ]);

          return res.status(200).json({ success: true });
        }
        return senderData;
      }

      case "acceptFriendRequest": {
        if (!requesterId || typeof requesterId !== "string") {
          return res
            .status(400)
            .json({ error: "Requester ID is required and must be a string" });
        }

        const userData = await fetchUserData(userId, "User");
        const requesterData = await fetchUserData(requesterId, "Requester");
        if (userData instanceof Object && requesterData instanceof Object) {
          if (userData.blockedUsers?.includes(requesterId)) {
            return res.status(403).json({
              error:
                "You have blocked this user and cannot accept their friend request",
            });
          }
          if (requesterData.blockedUsers?.includes(userId)) {
            return res.status(403).json({ error: "This user has blocked you" });
          }

          if (!userData.friendRequests?.includes(requesterId)) {
            return res
              .status(400)
              .json({ error: "No friend request found from this user" });
          }

          if (userData.friends?.includes(requesterId)) {
            return res
              .status(400)
              .json({ error: "You are already friends with this user" });
          }

          await Promise.all([
            db
              .collection("users")
              .doc(userId)
              .update({
                friends: admin.firestore.FieldValue.arrayUnion(requesterId),
                friendRequests:
                  admin.firestore.FieldValue.arrayRemove(requesterId),
              }),
            db
              .collection("users")
              .doc(requesterId)
              .update({
                friends: admin.firestore.FieldValue.arrayUnion(userId),
                friendRequestsSent:
                  admin.firestore.FieldValue.arrayRemove(userId),
              }),
          ]);

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
                recipientIds: [requesterId],
                type: "friendRequestAccepted",
                message: `${userData.username} accepted your friend request`,
                senderId: userId,
                relatedEntity: null,
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn(
              "Failed to create notification for friend request acceptance"
            );
          }

          return res.status(200).json({ success: true });
        }
        return userData instanceof Object ? requesterData : userData;
      }

      case "removeFriend": {
        if (!friendId || typeof friendId !== "string") {
          return res
            .status(400)
            .json({ error: "Friend ID is required and must be a string" });
        }

        const userData = await fetchUserData(userId, "User");
        if (userData instanceof Object) {
          if (!userData.friends?.includes(friendId)) {
            return res
              .status(400)
              .json({ error: "This user is not in your friends list" });
          }

          await Promise.all([
            db
              .collection("users")
              .doc(friendId)
              .update({
                friends: admin.firestore.FieldValue.arrayRemove(userId),
              }),
            db
              .collection("users")
              .doc(userId)
              .update({
                friends: admin.firestore.FieldValue.arrayRemove(friendId),
              }),
          ]);

          return res.status(200).json({ success: true });
        }
        return userData;
      }

      case "getUserData": {
        if (!userId || typeof userId !== "string") {
          return res
            .status(400)
            .json({ error: "User ID is required and must be a string" });
        }

        const userData = await fetchUserData(userId, "User");
        if (userData instanceof Object) {
          const publicFields = [
            "username",
            "bio",
            "courses",
            "interests",
            "year",
            "role",
            "profilePhoto",
          ];
          const restrictedData = {};
          publicFields.forEach((field) => {
            if (userData[field] !== undefined) {
              restrictedData[field] = userData[field];
            }
          });

          if (
            userId === userId ||
            userData.friends?.includes(userId) ||
            userData.settings.privacy === "everyone"
          ) {
            return res.status(200).json({ userData });
          } else if (userData.settings.privacy === "friends") {
            return res.status(200).json({ userData: restrictedData });
          } else {
            return res.status(403).json({
              error: "You do not have permission to view this user’s data",
            });
          }
        }
        return userData;
      }

      case "rejectFriendRequest": {
        if (!requesterId || typeof requesterId !== "string") {
          return res
            .status(400)
            .json({ error: "Requester ID is required and must be a string" });
        }

        const userData = await fetchUserData(userId, "User");
        if (userData instanceof Object) {
          if (!userData.friendRequests?.includes(requesterId)) {
            return res
              .status(400)
              .json({ error: "No friend request found from this user" });
          }

          await Promise.all([
            db
              .collection("users")
              .doc(userId)
              .update({
                friendRequests:
                  admin.firestore.FieldValue.arrayRemove(requesterId),
              }),
            db
              .collection("users")
              .doc(requesterId)
              .update({
                friendRequestsSent:
                  admin.firestore.FieldValue.arrayRemove(userId),
              }),
          ]);

          return res.status(200).json({ success: true });
        }
        return userData;
      }

      case "updateUser": {
        if (!updatedUserData || typeof updatedUserData !== "object") {
          return res.status(400).json({
            error: "Updated user data is required and must be an object",
          });
        }

        if (updatedUserData.id && updatedUserData.id !== userId) {
          return res
            .status(403)
            .json({ error: "You can only update your own user data" });
        }

        const allowedFields = [
          "username",
          "bio",
          "courses",
          "year",
          "interests",
          "settings",
        ];
        const filteredUpdates = Object.keys(updatedUserData).reduce(
          (acc, key) => {
            if (allowedFields.includes(key)) {
              acc[key] = updatedUserData[key];
            }
            return acc;
          },
          {}
        );

        if (Object.keys(filteredUpdates).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        const validationError = validateUserData(filteredUpdates, true, res);
        if (validationError) {
          return validationError;
        }

        if ("username" in filteredUpdates) {
          const usernameCheck = await checkUsernameUnique(
            filteredUpdates.username,
            userId,
            res
          );
          if (usernameCheck !== true) {
            return usernameCheck;
          }
        }

        await db.collection("users").doc(userId).update(filteredUpdates);

        return res
          .status(200)
          .json({ success: true, updatedFields: filteredUpdates });
      }

      case "updateProfilePhoto": {
        if (!fileBase64 || typeof fileBase64 !== "string") {
          return res.status(400).json({
            error: "A valid base64-encoded file is required to upload",
          });
        }
        if (!fileName || typeof fileName !== "string") {
          return res
            .status(400)
            .json({ error: "File name is required and must be a string" });
        }

        const userData = await fetchUserData(userId, "User");
        if (userData instanceof Object) {
          const oldProfilePhoto = userData.profilePhoto;

          const fileBuffer = Buffer.from(fileBase64, "base64");
          const storageRef = storage
            .bucket()
            .file(`profilePhotos/${userId}/${fileName}`);
          await storageRef.save(fileBuffer, {
            metadata: { contentType: "image/jpeg" },
          });
          const profilePhotoUrl = await storageRef
            .getSignedUrl({
              action: "read",
              expires: "03-09-2491",
            })
            .then((urls) => urls[0]);

          await db
            .collection("users")
            .doc(userId)
            .update({ profilePhoto: profilePhotoUrl });

          if (oldProfilePhoto && oldProfilePhoto !== profilePhotoUrl) {
            try {
              const oldPhotoRef = storage.bucket().file(oldProfilePhoto);
              await oldPhotoRef.delete();
              console.log(
                "Old profile photo deleted from storage:",
                oldProfilePhoto
              );
            } catch (storageError) {
              console.warn(
                "Could not delete old profile photo from storage:",
                storageError.message
              );
            }
          }

          return res.status(200).json({ success: true, profilePhotoUrl });
        }
        return userData;
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
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
