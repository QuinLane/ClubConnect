import express from "express";
import * as eventController from "../controllers/eventsController.js";
import Joi from "joi";

const eventSchema = Joi.object({
  clubID: Joi.number().integer().required(),
  eventName: Joi.string().required(),
  description: Joi.string().allow(null),
  reservationID: Joi.number().integer().required(),
});

const router = express.Router();

// Event CRUD
router.get("/", eventController.getAllEvents); // Get all events
router.get("/:eventID", eventController.getEventById); // Get event by ID
router.post("/", eventController.createEvent); // Create event
router.put("/:eventID", eventController.updateEvent); // Update event
router.delete("/:eventID", eventController.deleteEvent); // Delete event

export default router;
