import express from "express";
import Joi from "joi";
import * as clubController from "../controllers/clubController.js";
import { validate } from "../middleware/validate.js";
import {
  authenticate,
  requireSUAdmin,
  requireClubAdmin,
} from "../middleware/authenticate.js";

const router = express.Router();

// Joi schema for Club (POST)
const clubSchema = Joi.object({
  clubName: Joi.string().required(),
  description: Joi.string().allow(null),
});

// Joi schema for Club (PUT - partial updates)
const clubUpdateSchema = Joi.object({
  clubName: Joi.string(),
  description: Joi.string().allow(null),
}).min(1);

// Joi schema for adding/updating roles and members
const roleSchema = Joi.object({
  roleName: Joi.string().required(), // For creating a new ClubRole
});

const updateRoleSchema = Joi.object({
  clubRoleID: Joi.number().integer().allow(null), // For assigning a role to an executive
});

const memberSchema = Joi.object({
  userID: Joi.number().integer().required(),
});

// Club CRUD
router.get("/", clubController.getAllClubs);
router.get("/:clubID", clubController.getClubById);
router.post(
  "/",
  authenticate,
  requireSUAdmin,
  validate(clubSchema),
  clubController.createClub
);
router.put(
  "/:clubID",
  authenticate,
  requireClubAdmin,
  validate(clubUpdateSchema),
  clubController.updateClub
);
router.delete(
  "/:clubID",
  authenticate,
  requireSUAdmin,
  clubController.deleteClub
);

// Role and member management
router.put(
  "/:clubID/roles/:executiveID",
  authenticate,
  requireClubAdmin,
  validate(updateRoleSchema),
  clubController.updateClubRoles
);
router.post(
  "/:clubID/roles",
  authenticate,
  requireClubAdmin,
  validate(roleSchema),
  clubController.addClubRole
);
router.post(
  "/:clubID/members",
  authenticate,
  requireClubAdmin,
  validate(memberSchema),
  clubController.addMember
);
router.delete(
  "/:clubID/members/:userID",
  authenticate,
  requireClubAdmin,
  clubController.removeMember
);

export default router;
