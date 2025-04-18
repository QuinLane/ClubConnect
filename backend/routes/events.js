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

// Event routes
router.get("/", eventController.getAllEvents);
router.get("/:eventID", eventController.getEventById);
router.put(
  "/:eventID",
  authenticate,
  requireClubAdmin,
  validate(updateEventSchema),
  eventController.updateEvent
);
router.delete(
  "/:eventID",
  authenticate,
  requireClubAdmin,
  eventController.deleteEvent
);

export default router;
