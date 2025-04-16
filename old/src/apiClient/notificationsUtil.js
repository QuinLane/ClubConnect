/**
 * Defines the structure for the 'notifications' collection in Firestore and provides utility functions.
 */
import { apiRequest } from "./api"; // Import the fetch utility

/**
 * Structure for the 'notifications' collection
 */
const notificationStructure = {
  collectionName: "notifications",
  documentId: "Auto-generated Firestore ID",
  fields: {
    recipientId: {
      type: "string",
      required: true,
      description: "The UID of the user receiving the notification",
    },
    type: {
      type: "string",
      required: true,
      allowedValues: [
        "friendRequest",
        "friendRequestAccepted",
        "eventInvite",
        "groupJoinRequest",
        "chatMessage",
        "chatCreated",
        "chatMemberAdded",
        "chatJoined",
        "chatMemberRemoved",
        "chatLeft",
        "chatDeleted",
        "newChatMessage",
        "eventRSVP",
        "eventRsvpCancellation",
        "eventUpdate",
        "eventApproval",
        "eventDeletion",
        "groupCreated",
        "groupUpdate",
        "groupDeletion",
        "groupJoinAccepted",
        "groupMemberJoined",
        "groupJoinRequestCancelled",
        "groupMemberLeft",
        "groupAdminPromoted",
        "groupAdminAdded",
        "newSuggestions",
        "suggestionRemoved",
      ],
      description:
        "The type of notification (e.g., 'friendRequest', 'eventInvite')",
    },
    senderId: {
      type: "string",
      required: false,
      description:
        "The UID of the user who triggered the notification (optional)",
    },
    relatedEntity: {
      type: "object",
      required: false,
      description:
        "Reference to the related entity (e.g., { type: 'event', id: 'event123' })",
      subFields: {
        type: {
          type: "string",
          allowedValues: ["event", "group", "chat"],
          description:
            "The type of related entity (e.g., 'event', 'group', 'chat')",
        },
        id: {
          type: "string",
          description:
            "The ID of the related entity (e.g., event ID, group ID)",
        },
      },
    },
    message: {
      type: "string",
      required: true,
      description:
        "Human-readable message (e.g., 'John sent you a friend request')",
    },
    isRead: {
      type: "boolean",
      required: true,
      default: false,
      description: "Whether the notification has been read",
    },
    createdAt: {
      type: "timestamp",
      required: true,
      default: "serverTimestamp",
      description: "Timestamp when the notification was created",
    },
  },
};

/**
 * Creates a new notification by calling the API endpoint.
 */
const createNotification = async (
  recipientId,
  type,
  message,
  senderId,
  relatedEntity
) => {
  const response = await apiRequest("/api/notifications", "POST", {
    action: "createNotification",
    recipientId,
    type,
    message,
    senderId,
    relatedEntity,
  });
  return response.notificationId; // Assuming the API returns the new notification ID
};

/**
 * Fetches notifications for a user by calling the API endpoint.
 */
const getUserNotifications = async (userId, options = {}) => {
  const { unreadOnly = false } = options;
  const response = await apiRequest("/api/notifications", "POST", {
    action: "getUserNotifications",
    userId,
    unreadOnly,
  });
  return response.notifications; // Assuming the API returns { notifications: [...] }
};

/**
 * Marks a specific notification as read by calling the API endpoint.
 */
const markNotificationAsRead = async (notificationId) => {
  const response = await apiRequest("/api/notifications", "POST", {
    action: "markNotificationAsRead",
    notificationId,
  });
  return response.success;
};

/**
 * Marks all notifications for a user as read by calling the API endpoint.
 */
const markAllNotificationsAsRead = async (userId) => {
  const response = await apiRequest("/api/notifications", "POST", {
    action: "markAllNotificationsAsRead",
    userId,
  });
  return response.success;
};

/**
 * Deletes a specific notification by calling the API endpoint.
 */
const deleteNotification = async (notificationId) => {
  const response = await apiRequest("/api/notifications", "POST", {
    action: "deleteNotification",
    notificationId,
  });
  return response.success;
};

/**
 * Deletes all notifications for a user by calling the API endpoint.
 */
const deleteAllNotifications = async (userId) => {
  const response = await apiRequest("/api/notifications", "POST", {
    action: "deleteAllNotifications",
    userId,
  });
  return response.success;
};

export {
  notificationStructure,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
