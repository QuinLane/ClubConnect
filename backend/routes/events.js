import express from "express";
import Joi from "joi";
import * as eventController from "../controllers/eventController.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireClubAdmin } from "../middleware/authenticate.js";

const router = express.Router();

// Joi schema for updating events
const updateEventSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
}).min(1);

// Joi schema for searching events
const searchSchema = Joi.object({
  query: Joi.string().required(),
});

// Event routes
router.get("/", eventController.getAllEvents);
router.get("/upcoming", eventController.getUpcomingEvents);
router.get("/upcoming/club/:clubID", eventController.getUpcomingClubEvents);
router.get("/upcoming/user/:userID", eventController.getUpcomingUserEvents);
router.get("/club/:clubID", eventController.getEventsByClub);
router.get("/search", validate(searchSchema), eventController.searchEvents);
router.get("/recommended/:userID", eventController.getUserRecommendedEvents);
router.get("/:eventID", eventController.getEventById);
router.get("/:eventID/rsvp-count", eventController.getRSVPCount);
router.put(
  "/:eventID",
  authenticate,
  requireClubAdmin,
  validate(updateEventSchema),
  eventController.updateEvent
); //EXPECTS FORMDATA IF YOU NEED TO UPDATE IMAGE
router.delete(
  "/:eventID",
  authenticate,
  requireClubAdmin,
  eventController.deleteEvent
);

export default router;
