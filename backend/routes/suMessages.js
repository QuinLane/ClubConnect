import express from "express";
import Joi from "joi";
import * as suMessageController from "../controllers/suMessageController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Joi schema for sending SU message
const sendMessageSchema = Joi.object({
  userID: Joi.number().integer().required(),
  content: Joi.string().required(),
});

// Joi schema for replying to SU message
const replyMessageSchema = Joi.object({
  userID: Joi.number().integer().required(),
  content: Joi.string().required(),
  suAdminID: Joi.number().integer().required(),
});

// SU Message routes
router.post(
  "/messageStudent",
  authenticate,
  validate(sendMessageSchema),
  suMessageController.sendMessageStudent
);

router.post(
  "/messageSU",
  authenticate,
  validate(replyMessageSchema),
  suMessageController.sendMessageSU
);

router.get(
  "/conversation/:userID",
  authenticate,
  suMessageController.getConversation
);

router.get(
  "/threads",
  authenticate,
  suMessageController.getSUThreads
);

router.put(
  "/read/:messageID/:userID",
  authenticate,
  suMessageController.markSUMessageRead
);

export default router;
