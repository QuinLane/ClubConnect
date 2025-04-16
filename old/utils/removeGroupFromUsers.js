import { db, admin } from "./firebaseAdmin.js";

const removeGroupFromUsers = async (groupId, members, joinRequests) => {
  const batch = db.batch();

  // Remove groupId from members' groups array
  if (members && members.length > 0) {
    members.forEach((memberId) => {
      const userRef = db.collection("users").doc(memberId);
      batch.update(userRef, {
        groups: admin.firestore.FieldValue.arrayRemove(groupId),
      });
    });
  }

  // Remove groupId from joinRequests' groupJoinRequests array
  if (joinRequests && joinRequests.length > 0) {
    joinRequests.forEach((userId) => {
      const userRef = db.collection("users").doc(userId);
      batch.update(userRef, {
        groupJoinRequests: admin.firestore.FieldValue.arrayRemove(groupId),
      });
    });
  }

  // Commit the batch if there are updates
  if (batch._ops.length > 0) {
    await batch.commit();
  }
};

export { removeGroupFromUsers };
