import { db } from "./firebaseAdmin.js";

const checkUsernameUnique = async (username, excludeUserId = null, res) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    const isUnique = querySnapshot.docs.every(
      (doc) => doc.id === excludeUserId
    );

    if (!isUnique && res) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    return isUnique;
  } catch (error) {
    console.error("Error checking username uniqueness:", error.message);
    if (res) {
      return res
        .status(500)
        .json({ error: "Failed to check username uniqueness" });
    }
    throw error;
  }
};

export { checkUsernameUnique };
