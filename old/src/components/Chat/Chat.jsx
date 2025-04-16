/**
 * Reusable Chat component for private messages and group chats
 *
 * Props:
 * - chatType: "private" or "group" to determine the chat type
 * - chatId: The ID of the chat (e.g., "uid1_uid2" for private chats, "groupId" for group chats)
 * - currentUserId: The UID of the current user
 *
 * Logic:
 * - Fetch messages in real-time using onSnapshot
 * - Send new messages to Firestore
 */

// Import React and hooks
import { useState, useEffect } from "react";

// Import Firebase services
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Import styles (for frontend team)
import styles from "./Chat.module.css";

// Define the Chat component
const Chat = ({ chatType, chatId, currentUserId }) => {
  const [messages, setMessages] = useState([]); // List of messages
  const [newMessage, setNewMessage] = useState(""); // Text input for new message
  const [error, setError] = useState(null); // Error state

  // Determine the collection path based on chat type
  const messagesCollectionPath =
    chatType === "private"
      ? `privateChats/${chatId}/messages`
      : `groups/${chatId}/messages`;

  const lastReadDocPath =
    chatType === "private"
      ? `privateChats/${chatId}`
      : `groups/${chatId}/lastRead`;

  // Fetch messages in real-time
  useEffect(() => {
    const messagesQuery = query(
      collection(db, messagesCollectionPath),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        try {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesData);
        } catch (err) {
          setError(err.message);
        }
      },
      (err) => {
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [chatType, chatId, messagesCollectionPath]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Ignore empty messages

    try {
      setError(null);

      // Add the new message to Firestore
      const messageData = {
        senderId: currentUserId,
        content: newMessage,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, messagesCollectionPath), messageData);

      // Update the last message in the chat (for private chats)
      if (chatType === "private") {
        const chatDocRef = doc(db, "privateChats", chatId);
        await updateDoc(chatDocRef, {
          lastMessage: newMessage,
          lastMessageTimestamp: serverTimestamp(),
        });
      }

      // Clear the input
      setNewMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the chat
  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.senderId === currentUserId
                ? styles.messageSent
                : styles.messageReceived
            }
          >
            <p>
              <strong>{message.senderId}:</strong> {message.content}
            </p>
            <small>{message.timestamp?.toDate().toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
