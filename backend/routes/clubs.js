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
const clubSchema = Joi.object({
  clubName: Joi.string().required(),
  description: Joi.string().allow(""),
});

const updateRoleSchema = Joi.object({
  clubRoleID: Joi.number().integer().allow(null),
});

const addRoleSchema = Joi.object({
  roleName: Joi.string().required(),
});

const addMemberSchema = Joi.object({
  userID: Joi.number().integer().required(),
});

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
); 
router.put(
  "/:clubID",
  authenticate,
  requireClubAdmin,
  validate(clubSchema),
  clubController.updateClub
); 
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

router.post("/:clubID/join", authenticate, clubController.joinClub);

router.patch(
  "/:clubID/bio",
  authenticate,
  requireClubAdmin,
  validate(Joi.object({ description: Joi.string().allow("") })),
  clubController.updateBio
);

router.delete("/:clubID/leave", authenticate, clubController.leaveClub);

router.patch(
  "/:clubID/name",
  authenticate,
  requireClubAdmin,
  validate(Joi.object({ clubName: Joi.string().required().min(1) })),
  clubController.updateClubName
);

router.patch(
  "/:clubID/contact",
  authenticate,
  requireClubAdmin,
  validate(
    Joi.object({
      clubEmail: Joi.string().email().required(),
      socialMediaLinks: Joi.string().allow(""),
      website: Joi.string().uri().allow(""),
    })
  ),
  clubController.updateContact
);

export default router;
