import express from "express";
import * as rsvpController from "../controllers/rsvpController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// RSVP routes
router.post("/:eventID/:userID", authenticate, rsvpController.submitRSVP);
router.delete("/:eventID/:userID", authenticate, rsvpController.unsubmitRSVP);
router.get("/:eventID", authenticate, rsvpController.getRSVPsForEvent);
router.get("/user/:userID", authenticate, rsvpController.getUserRSVPs);

export default router;
