import express from "express";
import * as userController from "../controllers/userController.js";
import Joi from "joi";

const userSchema = Joi.object({
  userType: Joi.string().valid("Student", "SUAdmin").required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  passwordHash: Joi.string().min(8).required(),
});

const router = express.Router();

// User CRUD
router.post("/login", userController.login); // Login endpoint
router.get("/", userController.getAllUsers); // Get all users
router.get("/:userID", userController.getUserById); // Get user by ID
router.post("/", userController.createUser); // Create user
router.put("/:userID", userController.updateUser); // Update user
router.delete("/:userID", userController.deleteUser); // Delete user

//Using authentication
router.post(
  "/announcements",
  authenticate,
  announcementController.createAnnouncement
);

//Ex using validation
import { validate } from "../middleware/validate.js";
router.post("/", validate(userSchema), userController.createUser);

export default router;
