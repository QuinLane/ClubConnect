import { db } from "./firebaseAdmin.js";

const getUserData = async (userId) => {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  return userDoc.data();
};

export { getUserData };
