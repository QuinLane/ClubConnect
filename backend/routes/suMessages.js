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
  threadID: Joi.number().integer().required(),
  content: Joi.string().required(),
  suAdminID: Joi.number().integer().required(),
});

// Joi schema for resolving SU thread
const resolveThreadSchema = Joi.object({
  threadID: Joi.number().integer().required(),
  suAdminID: Joi.number().integer().required(),
});

// SU Message routes
router.post(
  "/",
  authenticate,
  validate(sendMessageSchema),
  suMessageController.sendSUMessage
);
router.post(
  "/reply",
  authenticate,
  validate(replyMessageSchema),
  suMessageController.replyToSUMessage
);
router.get(
  "/thread/:threadID/:userID",
  authenticate,
  suMessageController.getSUThread
);
router.get("/threads/:userID", authenticate, suMessageController.getSUThreads);
router.put(
  "/read/:messageID/:userID",
  authenticate,
  suMessageController.markSUMessageRead
);
router.post(
  "/resolve",
  authenticate,
  validate(resolveThreadSchema),
  suMessageController.resolveSUThread
);

export default router;
