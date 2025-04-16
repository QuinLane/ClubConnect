/**
 * Firestore collection structure for chats (both private and group chats)
 */
import { apiRequest } from "./api"; // Import the fetch utility

/**
 * Structure for the 'chats' collection
 */
const chatStructure = {
  collectionName: "chats",
  documentId: "chatId", // Format: "uid1_uid2" for private chats, groupId for group chats
  fields: {
    members: {
      type: "array",
      required: true,
      description: "Array of UIDs of chat members (minimum 2)",
    },
    type: {
      type: "string",
      required: true,
      description: "Type of chat ('private' or 'group')",
    },
    groupId: {
      type: "string",
      required: false,
      description:
        "ID of the associated group (for group chats; null for private chats)",
    },
    lastMessage: {
      type: "string",
      required: false,
      description: "Content of the last message sent in the chat",
    },
    lastMessageTimestamp: {
      type: "timestamp",
      required: false,
      default: "serverTimestamp",
      description: "Timestamp of the last message",
    },
  },
  subcollections: {
    messages: {
      documentId: "messageId",
      fields: {
        senderId: {
          type: "string",
          required: true,
          description: "UID of the user who sent the message",
        },
        content: {
          type: "string",
          required: true,
          description: "Content of the message",
        },
        timestamp: {
          type: "timestamp",
          required: true,
          default: "serverTimestamp",
          description: "Timestamp when the message was sent",
        },
      },
    },
    lastRead: {
      documentId: "userId",
      fields: {
        timestamp: {
          type: "timestamp",
          required: true,
          default: "serverTimestamp",
          description: "Timestamp when the user last read the chat",
        },
      },
    },
  },
};

/**
 * Fetches chat data by calling the API endpoint.
 */
const getChatData = async (chatId) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "getChatData",
    chatId,
  });
  return response.chatData;
};

/**
 * Creates a new chat by calling the API endpoint.
 */
const createChat = async (chatDetails, chatId) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "createChat",
    chatDetails,
    chatId,
  });
  return response.success; // API returns success status
};

/**
 * Adds a member to a chat by calling the API endpoint.
 */
const addChatMember = async (chatId, userId) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "addChatMember",
    chatId,
    userId,
  });
  return response.success;
};

/**
 * Removes a member from a chat by calling the API endpoint.
 */
const removeChatMember = async (chatId, userId) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "removeChatMember",
    chatId,
    userId,
  });
  return response.success;
};

/**
 * Deletes a chat by calling the API endpoint.
 */
const deleteChat = async (chatId) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "deleteChat",
    chatId,
  });
  return response.success;
};

/**
 * Sends a message to a chat by calling the API endpoint.
 */
const sendMessage = async (chatId, content) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "sendMessage",
    chatId,
    content,
  });
  return response.success;
};

/**
 * Updates a user's last read timestamp for a chat by calling the API endpoint.
 */
const updateLastRead = async (chatId) => {
  const response = await apiRequest("/api/chats", "POST", {
    action: "updateLastRead",
    chatId,
  });
  return response.success;
};

export {
  chatStructure,
  createChat,
  getChatData,
  addChatMember,
  removeChatMember,
  deleteChat,
  sendMessage,
  updateLastRead,
};
