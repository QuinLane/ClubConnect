import express from "express";
import Joi from "joi";
import * as notificationController from "../controllers/notificationController.js";
import {
  authenticate,
  requireSUAdmin,
  requireClubAdmin,
} from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Joi schema for creating notifications
const createNotificationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  senderID: Joi.number().integer().required(),
  clubID: Joi.number().integer().allow(null),
  recipientIDs: Joi.array().items(Joi.number().integer()).required(),
});

// Joi schema for sending to all
const sendToAllSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  senderID: Joi.number().integer().required(),
});

// Joi schema for sending to club
const sendToClubSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  senderID: Joi.number().integer().required(),
  clubID: Joi.number().integer().required(),
});

// Notification routes
router.post(
  "/",
  authenticate,
  validate(createNotificationSchema),
  notificationController.createNotification
);
router.post(
  "/all",
  authenticate,
  requireSUAdmin,
  validate(sendToAllSchema),
  notificationController.sendNotificationToAll
);
router.post(
  "/club",
  authenticate,
  validate(sendToClubSchema),
  notificationController.sendNotificationToClub
);
router.get(
  "/user/:userID",
  authenticate,
  notificationController.getUserNotifications
);

router.get(
  "/sender/:userID",
  authenticate,
  notificationController.getNotificationsForSender
);

export default router;
