import { db } from "./firebaseAdmin.js";

const getChatData = async (chatId, res) => {
  const chatDoc = await db.collection("chats").doc(chatId).get();

  if (!chatDoc.exists) {
    if (res) {
      return res.status(404).json({ error: "Chat not found" });
    }
    throw new Error("Chat not found");
  }

  return { id: chatDoc.id, ...chatDoc.data() };
};

export { getChatData };
