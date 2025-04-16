import { db } from "./firebaseAdmin.js";

// Fetch event data
const getEventData = async (eventId) => {
  const eventDoc = await db.collection("events").doc(eventId).get();

  if (!eventDoc.exists) {
    throw new Error("Event not found");
  }

  return eventDoc.data();
};

export { getEventData };
