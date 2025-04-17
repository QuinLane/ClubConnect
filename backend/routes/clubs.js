import express from "express";
import * as clubController from "../controllers/clubsController.js";
import Joi from "joi";

const clubSchema = Joi.object({
  clubName: Joi.string().required(),
  description: Joi.string().allow(null),
});

const router = express.Router();

// Club CRUD
router.get("/", clubController.getAllClubs); // Get all clubs
router.get("/:clubID", clubController.getClubById); // Get club by ID
router.post("/", clubController.createClub); // Create club
router.put("/:clubID", clubController.updateClub); // Update club
router.delete("/:clubID", clubController.deleteClub); // Delete club

export default router;
