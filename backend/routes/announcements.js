import express from "express";
import * as announcementController from "../controllers/announcementsController.js";
import Joi from "joi";

const announcementSchema = Joi.object({
  userID: Joi.number().integer().required(),
  clubID: Joi.number().integer().allow(null),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const router = express.Router();

// Announcement CRUD
router.get("/", announcementController.getAllAnnouncements); // Get all announcements
router.get("/:announcementID", announcementController.getAnnouncementById); // Get announcement by ID
router.post("/", announcementController.createAnnouncement); // Create announcement
router.put("/:announcementID", announcementController.updateAnnouncement); // Update announcement
router.delete("/:announcementID", announcementController.deleteAnnouncement); // Delete announcement

export default router;
