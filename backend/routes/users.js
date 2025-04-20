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

// User CRUD
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



// router.get("/", userController.getAllUsers); // Get all users
// router.get("/:userID", userController.getUserById); // Get user by ID
// router.put("/:userID", userController.updateUser); // Update user
// router.delete("/:userID", userController.deleteUser); // Delete user

export default router;
