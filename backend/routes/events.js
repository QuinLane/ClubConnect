import express from "express";
import Joi from "joi";
import * as eventController from "../controllers/eventController.js";
import { validate } from "../middleware/validate.js";
import {
  authenticate,
  requireClubAdminForEvent,
  requireClubAdmin,
} from "../middleware/authenticate.js";

const router = express.Router();

const updateEventSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
}).or("name", "description"); 

const searchSchema = Joi.object({
  query: Joi.string().required(),
});

router.get("/", authenticate, eventController.getAllEvents);
router.get("/upcoming", authenticate, eventController.getUpcomingEvents);
router.get(
  "/upcoming/club/:clubID",
  authenticate,
  eventController.getUpcomingClubEvents
);
router.get(
  "/upcoming/user/:userID",
  authenticate,
  eventController.getUpcomingUserEvents
);
router.get("/club/:clubID", authenticate, eventController.getEventsByClub);
router.get(
  "/search",
  authenticate,
  validate(searchSchema),
  eventController.searchEvents
);
router.get(
  "/recommended/:userID",
  authenticate,
  eventController.getUserRecommendedEvents
);
router.get("/:eventID", authenticate, eventController.getEventById);
router.get("/:eventID/rsvp-count", authenticate, eventController.getRSVPCount);
router.put(
  "/:eventID",
  authenticate,
  requireClubAdminForEvent,
  eventController.updateEvent
); 
router.delete(
  "/:eventID",
  authenticate,
  requireClubAdminForEvent,
  eventController.deleteEvent
);

router.patch(
  "/:eventID",
  authenticate,
  requireClubAdminForEvent,
  validate(updateEventSchema),
  eventController.updateEvent
);

router.put(
  "/photo/:eventID",
  authenticate,
  requireClubAdminForEvent,
  eventController.updateEventPhoto
);

export default router;
