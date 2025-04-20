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
router.post("/", userController.createUser); // Create user
router.post("/login", userController.login); // Login endpoint
router.get("/:id/name", userController.getNameFromId);

// router.get("/", userController.getAllUsers); // Get all users
// router.get("/:userID", userController.getUserById); // Get user by ID
// router.put("/:userID", userController.updateUser); // Update user
// router.delete("/:userID", userController.deleteUser); // Delete user

export default router;
