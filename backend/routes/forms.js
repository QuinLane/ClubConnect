import express from "express";
import * as formController from "../controllers/formController.js";
import Joi from "joi";

const formSchema = Joi.object({
  clubID: Joi.number().integer().required(),
  formType: Joi.string()
    .valid("ClubCreation", "EventApproval", "Funding")
    .required(),
  status: Joi.string()
    .valid("Pending", "Approved", "Rejected")
    .default("Pending"),
  details: Joi.string().allow(null),
});

const router = express.Router();

// Form CRUD
router.get("/", formController.getAllForms); // Get all forms
router.get("/:formID", formController.getFormById); // Get form by ID
router.post("/", formController.createForm); // Create form
router.put("/:formID", formController.updateForm); // Update form (e.g., approve/reject)
router.delete("/:formID", formController.deleteForm); // Delete form

export default router;
