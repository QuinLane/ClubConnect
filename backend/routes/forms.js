import express from "express";
import Joi from "joi";
import * as formController from "../controllers/formController.js";
import { validate } from "../middleware/validate.js";
import {
  authenticate,
  requireSUAdmin,
} from "../middleware/authenticate.js";

const router = express.Router();

// Joi schema for form submission
const formSchema = Joi.object({
  formType: Joi.string()
    .valid("ClubCreation", "EventApproval", "Funding", "DeleteClub")
    .required(),
  details: Joi.object().required(),
});

// Joi schema for form approval
const approvalSchema = Joi.object({
  status: Joi.string().valid("Approved", "Rejected").required(),
});

// Form routes
router.get("/", authenticate, formController.getAllForms);
router.get("/open", authenticate, formController.getOpenForms);
router.get("/:formID", authenticate, formController.getFormById);
router.post(
  "/:userID",
  authenticate,
  validate(formSchema),
  formController.submitForm
);
router.put(
  "/:formID/approve",
  authenticate,
  requireSUAdmin,
  validate(approvalSchema),
  formController.handleFormApproval
);

export default router;
