import express from "express";
import Joi from "joi";
import * as executiveController from "../controllers/executiveController.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireSUAdmin } from "../middleware/authenticate.js";

const router = express.Router();

// Joi schema for creating/updating executives
const executiveSchema = Joi.object({
  userID: Joi.number().integer().required(),
  clubID: Joi.number().integer().required(),
  clubRoleID: Joi.number().integer().allow(null),
});

// Joi schema for assigning role
const roleSchema = Joi.object({
  clubRoleID: Joi.number().integer().allow(null).required(),
});

// Executive routes
router.get("/", executiveController.getAllExecutives);
router.get("/:executiveID", executiveController.getExecutiveById);
router.get("/club/:clubID", executiveController.getExecutivesByClub);
router.get("/user/:userID", executiveController.getExecutivesByUser);
router.post(
  "/",
  authenticate,
  requireSUAdmin,
  validate(executiveSchema),
  executiveController.createExecutive
);
router.put(
  "/:executiveID",
  authenticate,
  requireSUAdmin,
  validate(executiveSchema),
  executiveController.updateExecutive
);
router.delete(
  "/:executiveID",
  authenticate,
  requireSUAdmin,
  executiveController.deleteExecutive
);
router.put(
  "/:executiveID/role",
  authenticate,
  requireSUAdmin,
  validate(roleSchema),
  executiveController.assignRoleToExecutive
);

export default router;
