import { apiRequest } from "./api"; // Import the fetch utility
/**
 * Structure for the 'events' collection
 */
const eventsCollectionStructure = {
  collectionName: "events",
  fields: {
    title: {
      type: "string",
      required: true,
      maxLength: 50,
      description: "The title of the event (e.g., 'Hackathon 2025')",
    },
    description: {
      type: "string",
      required: false,
      description: "A description of the event (e.g., 'Coding event')",
    },
    date: {
      type: "timestamp",
      required: true,
      description: "The date and time of the event",
    },
    creatorId: {
      type: "string",
      required: true,
      description: "UID of the user who created the event",
    },
    approved: {
      type: "boolean",
      required: true,
      default: false,
      description: "Whether the event is approved by an admin",
    },
    createdAt: {
      type: "timestamp",
      required: true,
      default: "serverTimestamp",
      description: "Timestamp when the event is created",
    },
    location: {
      type: "string",
      required: true,
      description: "Location where the event is happening",
    },
    group: {
      type: "string",
      required: true, // For now, require each event to be attached to a group
      description: "GroupID of the group the event is attached to",
    },
    attendees: {
      type: "array",
      required: false,
      default: [],
      description: "Array of UIDs of users who have RSVP'd to the event",
    },
  },
};

/**
 * Fetches event data by calling the API endpoint.
 */
const getEventData = async (eventId) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "getEventData",
    eventId,
  });
  return response.eventData;
};

/**
 * Creates a new event by calling the API endpoint.
 */
const createEvent = async (eventDetails, user) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "createEvent",
    eventDetails,
  });
  return response.success ? response.eventId : null;
};

/**
 * Updates the details of an existing event by calling the API endpoint.
 */
const editEventDetails = async (eventId, updatedEventDetails) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "editEventDetails",
    eventId,
    updatedEventDetails,
  });
  return response.updatedFields;
};

/**
 * Deletes an event by calling the API endpoint.
 */
const deleteEvent = async (eventId) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "deleteEvent",
    eventId,
  });
  return response.success;
};

/**
 * Approves an event by calling the API endpoint.
 */
const approveEvent = async (eventId) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "approveEvent",
    eventId,
  });
  return response.success;
};

/**
 * Allows a user to RSVP to an event by calling the API endpoint.
 */
const rsvpToEvent = async (eventId) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "rsvpToEvent",
    eventId,
  });
  return response.success;
};

/**
 * Allows a user to cancel their RSVP to an event by calling the API endpoint.
 */
const cancelRsvp = async (eventId) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "cancelRsvp",
    eventId,
  });
  return response.success;
};

/**
 * Fetches detailed data for an event's attendees by calling the API endpoint.
 */
const getEventAttendees = async (eventId) => {
  const response = await apiRequest("/api/events", "POST", {
    action: "getEventAttendees",
    eventId,
  });
  return response.attendees;
};

export {
  eventsCollectionStructure,
  createEvent,
  editEventDetails,
  deleteEvent,
  approveEvent,
  rsvpToEvent,
  cancelRsvp,
  getEventAttendees,
  getEventData,
};
