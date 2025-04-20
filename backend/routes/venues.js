import express from "express";
import Joi from "joi";
import * as venueController from "../controllers/venueController.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireSUAdmin } from "../middleware/authenticate.js";

const router = express.Router();

// Joi schema for Venue (POST)
const venueSchema = Joi.object({
  name: Joi.string().required(),
  capacity: Joi.number().integer().min(1).required(),
  address: Joi.string().required(),
  type: Joi.string().allow(null), // Optional type field
});

// Joi schema for Venue (PUT - partial updates)
const venueUpdateSchema = Joi.object({
  name: Joi.string(),
  capacity: Joi.number().integer().min(1),
  address: Joi.string(),
  type: Joi.string().allow(null),
}).min(1); // At least one field required

// Joi schema for Reservation
const reservationSchema = Joi.object({
  venueID: Joi.number().integer().required(),
  eventID: Joi.number().integer().required(), // Added eventID
  date: Joi.date().required(),
});

// Venue CRUD
router.get("/", authenticate, venueController.getAllVenues);
router.get("/:venueID", authenticate, venueController.getVenueById);
router.post(
  "/",
  authenticate,
  requireSUAdmin,
  validate(venueSchema),
  venueController.createVenue
);
router.put(
  "/:venueID",
  authenticate,
  requireSUAdmin,
  validate(venueUpdateSchema),
  venueController.updateVenue
);
router.delete(
  "/:venueID",
  authenticate,
  requireSUAdmin,
  venueController.deleteVenue
);

// Reservation routes
router.post(
  "/reservations",
  authenticate,
  validate(reservationSchema),
  venueController.createReservation
);
router.delete(
  "/reservations/:reservationID",
  authenticate,
  venueController.deleteReservation
);

router.get(
  '/:venueID/upcoming-reservations',
  authenticate,            // or whatever middleware applies
  venueController.getUpcomingReservationsByVenue
);

export default router;
