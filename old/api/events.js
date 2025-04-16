import { db, admin } from "../utils/firebaseAdmin.js";
import { authenticate } from "../utils/authenticate.js";
import { getUserData } from "../utils/getUserData.js";
import { validateEventData } from "../utils/validateEventData.js";
import { checkEventDeletePermission } from "../utils/checkEventDeletePermission.js";
import { removeEventFromAttendees } from "../utils/removeEventFromAttendees.js";
import { checkGroupAdminPermission } from "../utils/checkGroupAdminPermission.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await authenticate(req);
    const { action, eventId, eventDetails, updatedEventDetails } = req.body;

    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ error: "Action is required and must be a string" });
    }

    const userData = await getUserData(userId); // Used by multiple actions

    // Helper function to fetch event data (used by multiple actions)
    const fetchEventData = async () => {
      if (!eventId || typeof eventId !== "string") {
        return res
          .status(400)
          .json({ error: "Event ID is required and must be a string" });
      }
      const eventDoc = await db.collection("events").doc(eventId).get();
      if (!eventDoc.exists) {
        return res.status(404).json({ error: "Event not found" });
      }
      const eventData = { id: eventDoc.id, ...eventDoc.data() };

      const groupDoc = await db.collection("groups").doc(eventData.group).get();
      if (!groupDoc.exists) {
        return res.status(404).json({ error: "Group not found" });
      }
      const groupData = groupDoc.data();
      if (!groupData.members.includes(userId)) {
        return res
          .status(403)
          .json({ error: "You are not a member of the event's group" });
      }
      return eventData;
    };

    switch (action) {
      case "getEventData": {
        const eventData = await fetchEventData();
        if (eventData instanceof Object && !(eventData instanceof Error)) {
          return res.status(200).json({ eventData });
        }
        return eventData; // Returns the 404 or 403 response
      }

      case "createEvent": {
        if (!eventDetails || typeof eventDetails !== "object") {
          return res.status(400).json({
            error: "Event details are required and must be an object",
          });
        }

        if (eventDetails.creatorId !== userId) {
          return res.status(400).json({
            error: "Creator ID must match the authenticated user's UID",
          });
        }

        const validationError = validateEventData(eventDetails, res);
        if (validationError) {
          return validationError;
        }

        const groupDoc = await db
          .collection("groups")
          .doc(eventDetails.group)
          .get();
        if (!groupDoc.exists) {
          return res.status(404).json({ error: "Group not found" });
        }
        const groupData = groupDoc.data();
        if (!groupData.members || !groupData.members.includes(userId)) {
          return res.status(403).json({
            error: "You must be a member of the group to create an event",
          });
        }

        const eventData = {
          title: eventDetails.title.trim(),
          description: eventDetails.description || "",
          date: eventDetails.date,
          creatorId: userId,
          approved: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          location: eventDetails.location,
          group: eventDetails.group,
          attendees: [],
        };

        const docRef = await db.collection("events").add(eventData);

        const recipients = groupData.members.filter((uid) => uid !== userId);
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
                type: "eventInvite",
                message: `${userData.username} created a new event: ${eventDetails.title}`,
                senderId: userId,
                relatedEntity: { type: "event", id: docRef.id },
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for event invite");
          }
        }

        return res.status(200).json({ success: true, eventId: docRef.id });
      }

      case "getEventAttendees": {
        const eventData = await fetchEventData();
        if (eventData instanceof Object && !(eventData instanceof Error)) {
          if (!eventData.attendees || eventData.attendees.length === 0) {
            return res.status(200).json({ attendees: [] });
          }

          const attendeePromises = eventData.attendees.map(async (uid) => {
            const userData = await getUserData(uid);
            return {
              uid,
              username: userData.username,
              profilePhoto: userData.profilePhoto || "",
            };
          });

          const attendees = await Promise.all(attendeePromises);
          return res.status(200).json({ attendees });
        }
        return eventData;
      }

      case "deleteEvent": {
        const eventData = await fetchEventData();
        if (eventData instanceof Object && !(eventData instanceof Error)) {
          const permissionCheck = await checkEventDeletePermission(
            eventData,
            userId,
            res
          );
          if (permissionCheck !== true) {
            return permissionCheck;
          }

          await removeEventFromAttendees(eventId, eventData.attendees);

          await db.collection("events").doc(eventId).delete();

          const recipients = (eventData.attendees || []).filter(
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
                  type: "eventDeletion",
                  message: `${userData.username} deleted the event: ${eventData.title}`,
                  senderId: userId,
                  relatedEntity: null,
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn("Failed to create notification for event deletion");
            }
          }

          return res.status(200).json({ success: true });
        }
        return eventData;
      }

      case "approveEvent": {
        if (userData.role !== "admin") {
          return res.status(403).json({
            error:
              "You do not have permission to approve this event. Only site admins can approve events",
          });
        }

        const eventData = await fetchEventData();
        if (eventData instanceof Object && !(eventData instanceof Error)) {
          await db.collection("events").doc(eventId).update({ approved: true });

          if (eventData.creatorId !== userId) {
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
                  recipientIds: [eventData.creatorId],
                  type: "eventApproval",
                  message: `${userData.username} approved your event: ${eventData.title}`,
                  senderId: userId,
                  relatedEntity: { type: "event", id: eventId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn("Failed to create notification for event approval");
            }
          }

          return res.status(200).json({ success: true });
        }
        return eventData;
      }

      case "rsvpToEvent": {
        const eventData = await fetchEventData();
        if (eventData instanceof Object && !(eventData instanceof Error)) {
          if (!eventData.approved) {
            return res
              .status(400)
              .json({ error: "Cannot RSVP to an unapproved event" });
          }

          if (eventData.attendees && eventData.attendees.includes(userId)) {
            return res
              .status(400)
              .json({ error: "You are already attending this event" });
          }

          const eventRef = db.collection("events").doc(eventId);
          const userRef = db.collection("users").doc(userId);

          await db.runTransaction(async (transaction) => {
            const eventDoc = await transaction.get(eventRef);
            if (!eventDoc.exists) {
              throw new Error("Event not found");
            }
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              throw new Error("User not found");
            }

            transaction.update(eventRef, {
              attendees: admin.firestore.FieldValue.arrayUnion(userId),
            });

            transaction.update(userRef, {
              eventsAttending: admin.firestore.FieldValue.arrayUnion(eventId),
            });
          });

          if (eventData.creatorId !== userId) {
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
                  recipientIds: [eventData.creatorId],
                  type: "eventRSVP",
                  message: `${userData.username} RSVP'd to your event: ${eventData.title}`,
                  senderId: userId,
                  relatedEntity: { type: "event", id: eventId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn("Failed to create notification for event RSVP");
            }
          }

          return res.status(200).json({ success: true });
        }
        return eventData;
      }

      case "editEventDetails": {
        if (!updatedEventDetails || typeof updatedEventDetails !== "object") {
          return res.status(400).json({
            error: "Updated event details are required and must be an object",
          });
        }

        const eventDoc = await db.collection("events").doc(eventId).get();
        if (!eventDoc.exists) {
          return res.status(404).json({ error: "Event not found" });
        }
        const eventData = eventDoc.data();

        const permissionCheck = await checkGroupAdminPermission(
          eventData.group,
          userId,
          res
        );
        if (permissionCheck !== true) {
          return permissionCheck;
        }

        const allowedFields = ["title", "description", "date", "location"];
        const filteredUpdates = Object.keys(updatedEventDetails).reduce(
          (acc, key) => {
            if (allowedFields.includes(key)) {
              acc[key] = updatedEventDetails[key];
            }
            return acc;
          },
          {}
        );

        if (Object.keys(filteredUpdates).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        const validationError = validateEventData(filteredUpdates, res);
        if (validationError) {
          return validationError;
        }

        await db.collection("events").doc(eventId).update(filteredUpdates);

        const recipients = eventData.attendees || [];
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
                type: "eventUpdate",
                message: `${userData.username} updated the event: ${eventData.title}`,
                senderId: userId,
                relatedEntity: { type: "event", id: eventId },
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.warn("Failed to create notification for event update");
          }
        }

        return res
          .status(200)
          .json({ success: true, updatedFields: filteredUpdates });
      }

      case "cancelRsvp": {
        const eventData = await fetchEventData();
        if (eventData instanceof Object && !(eventData instanceof Error)) {
          if (!eventData.attendees || !eventData.attendees.includes(userId)) {
            return res
              .status(400)
              .json({ error: "You are not attending this event" });
          }

          const eventRef = db.collection("events").doc(eventId);
          const userRef = db.collection("users").doc(userId);

          await db.runTransaction(async (transaction) => {
            const eventDoc = await transaction.get(eventRef);
            if (!eventDoc.exists) {
              throw new Error("Event not found");
            }
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              throw new Error("User not found");
            }

            transaction.update(eventRef, {
              attendees: admin.firestore.FieldValue.arrayRemove(userId),
            });

            transaction.update(userRef, {
              eventsAttending: admin.firestore.FieldValue.arrayRemove(eventId),
            });
          });

          if (eventData.creatorId !== userId) {
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
                  recipientIds: [eventData.creatorId],
                  type: "eventRsvpCancellation",
                  message: `${userData.username} cancelled their RSVP to your event: ${eventData.title}`,
                  senderId: userId,
                  relatedEntity: { type: "event", id: eventId },
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.warn(
                "Failed to create notification for event RSVP cancellation"
              );
            }
          }

          return res.status(200).json({ success: true });
        }
        return eventData;
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error("Error in function:", error.message);
    const status = error.message.includes("Unauthorized")
      ? 401
      : error.message.includes("User not found") ||
        error.message.includes("Event not found") ||
        error.message.includes("Group not found")
      ? 404
      : 500;
    return res.status(status).json({ error: error.message });
  }
};
