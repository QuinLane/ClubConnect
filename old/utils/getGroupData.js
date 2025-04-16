import { db } from "./firebaseAdmin.js";

const getGroupData = async (groupId, res) => {
  const groupDoc = await db.collection("groups").doc(groupId).get();

  if (!groupDoc.exists) {
    return res.status(404).json({ error: "Group not found" });
  }

  return groupDoc.data();
};

export { getGroupData };
