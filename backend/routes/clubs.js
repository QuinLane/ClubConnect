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
console.log("🔌 Clubs router loaded");
// Joi schema for creating/updating clubs
const clubSchema = Joi.object({
  clubName: Joi.string().required(),
  description: Joi.string().allow(""),
});

// Joi schema for updating club roles
const updateRoleSchema = Joi.object({
  clubRoleID: Joi.number().integer().allow(null),
});

// Joi schema for adding club roles
const addRoleSchema = Joi.object({
  roleName: Joi.string().required(),
});

// Joi schema for adding members
const addMemberSchema = Joi.object({
  userID: Joi.number().integer().required(),
});

// Joi schema for searching clubs
const searchSchema = Joi.object({
  query: Joi.string().required(),
});

router.get("/", authenticate, clubController.getAllClubs);
router.get(
  "/search",
  authenticate,
  validate(searchSchema),
  clubController.searchClubs
);
router.get("/stats/:clubID", authenticate, clubController.getClubStats);
router.get(
  "/members/:clubID",
  authenticate,
  requireClubAdmin,
  clubController.getClubMembers
);
router.get("/user/:userID", authenticate, clubController.getUserClubs);
router.get("/user-exec/:userID", authenticate, clubController.getUserExecClubs);
router.get("/:clubID", clubController.getClubById);
router.post(
  "/",
  authenticate,
  requireSUAdmin,
  validate(clubSchema),
  clubController.createClub
); //EXPECTS FORMDATA IF YOU NEED TO INCLUDE IMAGE OTHERWISE IT USES DEFAULT
router.put(
  "/:clubID",
  authenticate,
  requireClubAdmin,
  validate(clubSchema),
  clubController.updateClub
); //EXPECTS FORMDATA IF YOU NEED TO UPDATE IMAGE
router.delete(
  "/:clubID",
  authenticate,
  requireSUAdmin,
  clubController.deleteClub
);
router.put(
  "/:clubID/executives/:userID",
  authenticate,
  requireClubAdmin,
  validate(updateRoleSchema),
  clubController.updateClubRoles
);
router.post(
  "/:clubID/members",
  authenticate,
  requireClubAdmin,
  validate(addMemberSchema),
  clubController.addMember
);
router.delete(
  "/:clubID/members/:userID",
  authenticate,
  requireClubAdmin,
  clubController.removeMember
);

// Add this with your other routes
router.post(
  "/:clubID/join",
  authenticate,
  clubController.joinClub
);

export default router;
