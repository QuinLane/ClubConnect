import express from "express";
import * as suController from "../controllers/suController.js";
import { authenticate, requireSUAdmin } from "../middleware/authenticate.js";

const router = express.Router();

// SU routes
router.get(
  "/open-forms",
  authenticate,
  requireSUAdmin,
  suController.getAllOpenForms
);
router.get("/stats", authenticate, requireSUAdmin, suController.getSUStats);
router.get(
  "/active-threads",
  authenticate,
  requireSUAdmin,
  suController.getSUActiveThreads
);

export default router;
