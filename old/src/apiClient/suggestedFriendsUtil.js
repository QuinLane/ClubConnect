/**
 * Defines the structure for the 'suggestedFriends' collection in Firestore and provides utility functions.
 */
import { apiRequest } from "./api"; // Import the fetch utility

/**
 * Structure for the 'suggestedFriends' collection
 */
const suggestedFriendsStructure = {
  collectionName: "suggestedFriends",
  fields: {
    userId: {
      type: "string",
      required: true,
      description: "UID of the user receiving the suggestion",
    },
    suggestedUserId: {
      type: "string",
      required: true,
      description: "UID of the user being suggested as a friend",
    },
    reason: {
      type: "string",
      required: true,
      description: "Reason for the suggestion (e.g., 'Shared course: SENG513')",
    },
    createdAt: {
      type: "timestamp",
      required: true,
      default: "serverTimestamp",
      description: "Timestamp when the suggestion was created",
    },
  },
};

/**
 * Generates suggested friends for a user by calling the API endpoint.
 */
const generateSuggestions = async () => {
  const response = await apiRequest("/api/suggestedFriends", "POST", {
    action: "generateSuggestions",
  });
  return response.success;
};

/**
 * Fetches suggested friends for a user by calling the API endpoint.
 */
const getUserSuggestions = async () => {
  const response = await apiRequest("/api/suggestedFriends", "POST", {
    action: "getUserSuggestions",
  });
  return response.suggestions;
};

/**
 * Removes a suggestion by calling the API endpoint.
 */
const removeSuggestion = async (suggestionId) => {
  const response = await apiRequest("/api/suggestedFriends", "POST", {
    action: "removeSuggestions",
    suggestionId,
  });
  return response.success;
};

/**
 * Fetches a single suggestion's data by calling the API endpoint.
 */
const getSuggestionData = async (suggestionId) => {
  const response = await apiRequest("/api/suggestedFriends", "POST", {
    action: "getSuggestionData",
    suggestionId,
  });
  return response.suggestionData;
};

export {
  suggestedFriendsStructure,
  generateSuggestions,
  getUserSuggestions,
  removeSuggestion,
  getSuggestionData,
};
