import { db } from "./firebaseAdmin.js";

const getSuggestionData = async (suggestionId, res) => {
  const suggestionDoc = await db
    .collection("suggestedFriends")
    .doc(suggestionId)
    .get();

  if (!suggestionDoc.exists) {
    if (res) {
      return res.status(404).json({ error: "Suggestion not found" });
    }
    throw new Error("Suggestion not found");
  }

  return suggestionDoc.data();
};

export { getSuggestionData };
