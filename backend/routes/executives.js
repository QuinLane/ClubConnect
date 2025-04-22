import express from "express";
import Joi from "joi";
import * as executiveController from "../controllers/executiveController.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireSUAdmin } from "../middleware/authenticate.js";

const router = express.Router();

const executiveSchema = Joi.object({
  email: Joi.string().email().required(),
  clubID: Joi.number().integer().required(),
  role: Joi.string().allow(null),
});
const roleSchema = Joi.object({
  role: Joi.string().allow(null).required(), 
});

router.put(
  "/:clubID/:userID/role",
  authenticate,
  validate(roleSchema),
  executiveController.assignRoleToExecutive
);
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
  authenticate,  // Changed from requireSUAdmin
  executiveController.deleteExecutive
);
router.put(
  "/:clubID/:userID/role",
  authenticate,
  validate(roleSchema),
  executiveController.assignRoleToExecutive
);

export default router;
