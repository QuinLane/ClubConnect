import express from "express";
import * as executiveController from "../controllers/executivesController.js";
import Joi from "joi";

const executiveSchema = Joi.object({
  userID: Joi.number().integer().required(),
  clubID: Joi.number().integer().required(),
  position: Joi.string().required(),
});

const router = express.Router();

// Executive CRUD
router.get("/", executiveController.getAllExecutives); // Get all executives
router.get("/:executiveID", executiveController.getExecutiveById); // Get executive by ID
router.post("/", executiveController.createExecutive); // Create executive
router.put("/:executiveID", executiveController.updateExecutive); // Update executive
router.delete("/:executiveID", executiveController.deleteExecutive); // Delete executive

export default router;
