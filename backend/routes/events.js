import express from "express";
import * as eventController from "../controllers/eventsController.js";
import Joi from "joi";

const eventSchema = Joi.object({
  clubID: Joi.number().integer().required(),
  eventName: Joi.string().required(),
  eventDate: Joi.date().required(),
  location: Joi.string().allow(null),
  description: Joi.string().allow(null),
});

const router = express.Router();

// Event CRUD
router.get("/", eventController.getAllEvents); // Get all events
router.get("/:eventID", eventController.getEventById); // Get event by ID
router.post("/", eventController.createEvent); // Create event
router.put("/:eventID", eventController.updateEvent); // Update event
router.delete("/:eventID", eventController.deleteEvent); // Delete event

export default router;
