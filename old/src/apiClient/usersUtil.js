/**
 * Defines the structure for the 'users' collection in Firestore and provides utility functions.
 */
import { apiRequest } from "./api";

/**
 * Structure for the 'users' collection
 */
const usersCollectionStructure = {
  collectionName: "users",
  documentId: "UID of the user",
  fields: {
    username: {
      type: "string",
      required: true,
      maxLength: 20,
      unique: true,
      description: "Unique username for the user (e.g., 'john_doe')",
    },
    bio: {
      type: "string",
      required: false,
      maxLength: 160,
      description: "A short bio about the user",
    },
    courses: {
      type: "array",
      required: true,
      description: "Array of course codes the user is enrolled in",
    },
    interests: {
      type: "array",
      required: false,
      default: [],
      description: "Array of user interests",
    },
    year: {
      type: "string",
      required: false,
      description: "User's academic year (e.g., '3rd')",
    },
    role: {
      type: "string",
      required: true,
      default: "student",
      allowedValues: ["student", "admin"],
      description: "User's role",
    },
    profilePhoto: {
      type: "string",
      required: false,
      default: "",
      description: "URL or path to the user's profile photo",
    },
    createdAt: {
      type: "timestamp",
      required: true,
      default: "serverTimestamp",
      description: "Timestamp when the user account was created",
    },
    friends: {
      type: "array",
      required: true,
      default: [],
      description: "Array of UIDs of the user's friends",
    },
    friendRequests: {
      type: "array",
      required: true,
      default: [],
      description: "Array of UIDs of users who sent friend requests",
    },
    friendRequestsSent: {
      type: "array",
      required: true,
      default: [],
      description: "Array of UIDs of users to whom friend requests were sent",
    },
    settings: {
      type: "object",
      required: true,
      fields: {
        notifications: {
          type: "object",
          required: true,
          fields: {
            email: { type: "boolean", required: true, default: true },
            push: { type: "boolean", required: true, default: true },
          },
        },
        privacy: {
          type: "string",
          required: true,
          default: "everyone",
          allowedValues: ["everyone", "friends", "none"],
        },
        theme: {
          type: "string",
          required: true,
          default: "light",
          allowedValues: ["light", "dark"],
        },
      },
    },
    groups: {
      type: "array",
      required: true,
      default: [],
      description: "Array of group IDs the user is a member of",
    },
    groupJoinRequests: {
      type: "array",
      required: true,
      default: [],
      description: "Array of group IDs the user has requested to join",
    },
    privateChats: {
      type: "array",
      required: true,
      default: [],
      description: "Array of chat IDs for private chats the user is in",
    },
    eventsAttending: {
      type: "array",
      required: true,
      default: [],
      description: "Array of event IDs the user is attending",
    },
    blockedUsers: {
      type: "array",
      required: true,
      default: [],
      description: "Array of UIDs of users blocked by this user",
    },
  },
};

/**
 * Fetches user data by calling the API endpoint.
 */
const getUserData = async (userId) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "getUserData",
    userId,
  });
  return response.userData;
};

/**
 * Creates a new user by calling the API endpoint.
 */
const createUser = async (userDetails, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "createUser",
    ...userDetails,
  });
  return response.success;
};

/**
 * Updates user profile data by calling the API endpoint.
 */
const updateUser = async (updatedUserData, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "updateUser",
    ...updatedUserData,
  });
  return response.updatedFields;
};

/**
 * Updates the user's profile photo by calling the API endpoint.
 */
const updateProfilePhoto = async (fileData, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "updateProfilePhoto",
    ...fileData,
  });
  return response.profilePhotoUrl;
};

/**
 * Deletes a user account by calling the API endpoint.
 */
const deleteUserAccount = async (user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "deleteUserAccount",
  });
  return response.success;
};

/**
 * Sends a friend request by calling the API endpoint.
 */
const sendFriendRequest = async (recipientId, suggestionId, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "sendFriendRequest",
    recipientId,
    suggestionId,
  });
  return response.success;
};

/**
 * Accepts a friend request by calling the API endpoint.
 */
const acceptFriendRequest = async (requesterId, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "acceptFriendRequest",
    requesterId,
  });
  return response.success;
};

/**
 * Rejects a friend request by calling the API endpoint.
 */
const rejectFriendRequest = async (requesterId, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "rejectFriendRequest",
    requesterId,
  });
  return response.success;
};

/**
 * Removes a sent friend request by calling the API endpoint.
 */
const removeFriendRequest = async (recipientId, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "removeFriendRequest",
    recipientId,
  });
  return response.success;
};

/**
 * Removes a friend by calling the API endpoint.
 */
const removeFriend = async (friendId, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "removeFriend",
    friendId,
  });
  return response.success;
};

/**
 * Blocks a user by calling the API endpoint.
 */
const blockUser = async (userIdToBlock, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "blockUser",
    userIdToBlock,
  });
  return response.success;
};

/**
 * Unblocks a user by calling the API endpoint.
 */
const unblockUser = async (userIdToUnblock, user) => {
  const response = await apiRequest("/api/users", "POST", {
    action: "unblockUser",
    userIdToUnblock,
  });
  return response.success;
};

export {
  usersCollectionStructure,
  getUserData,
  createUser,
  updateUser,
  updateProfilePhoto,
  deleteUserAccount,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriendRequest,
  removeFriend,
  blockUser,
  unblockUser,
};
