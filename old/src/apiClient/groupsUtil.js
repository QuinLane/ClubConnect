/**
 * Defines the structure for the 'groups' collection in Firestore and provides utility functions.
 */

import { apiRequest } from "./api"; // Import the fetch utility

/**
 * Structure for the 'groups' collection
 */
const groupsCollectionStructure = {
  collectionName: "groups",
  fields: {
    name: {
      type: "string",
      required: true,
      maxLength: 100,
      unique: true,
      description:
        "The unique name of the group (e.g., 'SENG 513 Study Group')",
    },
    description: {
      type: "string",
      required: false,
      description: "A description of the group (e.g., 'For SENG 513 students')",
    },
    ownerId: {
      type: "string",
      required: true,
      description: "UID of the user who owns the group",
    },
    members: {
      type: "array",
      required: true,
      default: [],
      description: "Array of UIDs of group members",
    },
    CreatedAt: {
      type: "timestamp",
      required: true,
      default: "serverTimestamp",
      description: "The timestamp when the group is created, set by the server",
    },
    joinRequests: {
      type: "array",
      required: false,
      default: [],
      description:
        "Array of UIDs of users who have requested to join the group",
    },
    admins: {
      type: "array",
      required: true,
      default: [], // Will be set to [ownerId] at creation time
      description:
        "Array of UIDs of users who have admin permissions in a group. The ownerId should be added here automatically.",
    },
    events: {
      type: "array",
      required: true,
      default: [],
      description:
        "Array of eventIDs of the events the group currently has posted.",
    },
  },
};

/**
 * Fetches group data by calling the API endpoint.
 */
const getGroupData = async (groupId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "getGroupData",
    groupId,
  });
  return response.groupData;
};

const createGroup = async (groupDetails) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "createGroup",
    groupDetails,
  });
  return response.groupId;
};

const editGroupDetails = async (groupId, updatedGroupDetails) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "editGroupDetails",
    groupId,
    updatedGroupDetails,
  });
  return response.updatedFields;
};

const deleteGroup = async (groupId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "deleteGroup",
    groupId,
  });
  return response.success;
};

const sendGroupJoinRequest = async (groupId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "sendGroupJoinRequest",
    groupId,
  });
  return response.success;
};

const removeGroupJoinRequest = async (groupId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "removeGroupJoinRequest",
    groupId,
  });
  return response.success;
};

const leaveGroup = async (groupId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "leaveGroup",
    groupId,
  });
  return response.success;
};

const acceptGroupJoinRequest = async (groupId, userId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "acceptGroupJoinRequest",
    groupId,
    userId,
  });
  return response.success;
};

const addGroupAdmin = async (groupId, userId) => {
  const response = await apiRequest("/api/groups", "POST", {
    action: "addGroupAdmin",
    groupId,
    userId,
  });
  return response.success;
};

export {
  groupsCollectionStructure,
  createGroup,
  editGroupDetails,
  deleteGroup,
  getGroupData,
  sendGroupJoinRequest,
  removeGroupJoinRequest,
  leaveGroup,
  acceptGroupJoinRequest,
  addGroupAdmin,
};
