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
router.get("/", authenticate, executiveController.getAllExecutives);
router.get(
  "/club/:clubID",
  authenticate,
  executiveController.getExecutivesByClub
);
router.get(
  "/user/:userID",
  authenticate,
  executiveController.getExecutivesByUser
);
router.get(
  "/:clubID/:userID",
  authenticate,
  executiveController.getExecutiveById
);
router.post(
  "/",
  authenticate,
  requireSUAdmin,
  validate(executiveSchema),
  executiveController.createExecutive
);
router.put(
  "/:clubID/:userID",
  authenticate,
  requireSUAdmin,
  validate(executiveSchema),
  executiveController.updateExecutive
);
router.delete(
  "/:clubID/:userID",
  authenticate,
  requireSUAdmin,
  executiveController.deleteExecutive
);
router.put(
  "/:clubID/:userID/role",
  authenticate,
  requireSUAdmin,
  validate(roleSchema),
  executiveController.assignRoleToExecutive
);

export default router;
