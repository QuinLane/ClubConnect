import { db } from "./firebaseAdmin.js";

const checkGroupNameUnique = async (name, excludeGroupId = null) => {
  const groupsRef = db.collection("groups").where("name", "==", name);
  const querySnapshot = await groupsRef.get();

  if (querySnapshot.empty) {
    return true; // Name is unique
  }

  if (excludeGroupId) {
    // If excludeGroupId is provided (e.g., during an update), check if the only matching group is the one being updated
    return querySnapshot.docs.every((doc) => doc.id === excludeGroupId);
  }

  return false; // Name is not unique
};

export { checkGroupNameUnique };
