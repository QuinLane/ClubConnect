import express from "express";
import * as userController from "../controllers/userController.js";
import Joi from "joi";
import { authenticate } from "../middleware/authenticate.js";

const userSchema = Joi.object({
  userType: Joi.string().valid("Student", "SUAdmin").required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  passwordHash: Joi.string().min(8).required(),
});

const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.login); 
router.get("/:id/name", userController.getNameFromId);
router.patch(
  "/:userID/make-admin",
  authenticate,
  userController.makeUserAdmin
);

router.patch(
  "/:userID/make-student",
  authenticate,
  userController.makeUserStudent
);

router.get(
  '/getall',
  authenticate,
  userController.getAllUsers
);

// router for users
router.get(
  "/:id",
  authenticate,
  userController.getUserById
);


export default router;
