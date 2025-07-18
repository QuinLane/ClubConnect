import express from "express";
import Joi from "joi";
import * as suMessageController from "../controllers/suMessageController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

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


router.get(
  '/exec-ids',
  authenticate,
  suMessageController.getDistinctExecIDs
);

export default router;
