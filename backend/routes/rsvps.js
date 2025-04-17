import express from "express";
import * as rsvpController from "../controllers/rsvpController.js";
import Joi from "joi";

const rsvpSchema = Joi.object({
  userID: Joi.number().integer().required(),
  eventID: Joi.number().integer().required(),
});

const router = express.Router();

// RSVP CRUD
router.get("/", rsvpController.getAllRSVPs); // Get all RSVPs
router.get("/:rsvpID", rsvpController.getRSVPById); // Get RSVP by ID
router.post("/", rsvpController.createRSVP); // Create RSVP
router.delete("/:rsvpID", rsvpController.deleteRSVP); // Delete RSVP

export default router;
