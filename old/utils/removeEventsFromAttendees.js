import { db, admin } from "./firebaseAdmin.js";

const removeEventFromAttendees = async (eventId, attendees) => {
  if (!attendees || attendees.length === 0) {
    return; // No attendees to update
  }

  const batch = db.batch();
  attendees.forEach((attendeeId) => {
    const userRef = db.collection("users").doc(attendeeId);
    batch.update(userRef, {
      eventsAttending: admin.firestore.FieldValue.arrayRemove(eventId),
    });
  });

  await batch.commit();
};

export { removeEventFromAttendees };
