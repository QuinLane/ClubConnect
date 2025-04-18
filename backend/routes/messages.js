import express from "express";
import * as messageController from "../controllers/messageController.js";
import Joi from "joi";

const messageSchema = Joi.object({
  senderID: Joi.number().integer().required(),
  receiverID: Joi.number().integer().required(),
  content: Joi.string().required(),
  isRead: Joi.boolean().default(false),
});

const router = express.Router();

// Message CRUD
router.get("/", messageController.getAllMessages); // Get all messages (admin use)
router.get("/:messageID", messageController.getMessageById); // Get message by ID
router.post("/", messageController.createMessage); // Send message
router.put("/:messageID", messageController.updateMessage); // Update message (e.g., mark as read)
router.delete("/:messageID", messageController.deleteMessage); // Delete message

export default router;
