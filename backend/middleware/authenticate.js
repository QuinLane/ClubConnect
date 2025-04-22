import jwt from "jsonwebtoken";
import { checkClubAdminPermissions } from "../controllers/clubController.js";
import { checkClubAdminPermissionsForEvent } from "../controllers/eventController.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireSUAdmin = (req, res, next) => {
  const { userType } = req.user;
  if (userType !== "SUAdmin") {
    return res.status(403).json({ error: "SUAdmin role required" });
  }
  next();
};

export const requireClubAdmin = async (req, res, next) => {
  const { clubID } = req.params;
  const { userID } = req.user;
  try {
    const isClubAdmin = await checkClubAdminPermissions(
      parseInt(userID),
      parseInt(clubID)
    );
    if (!isClubAdmin) {
      return res.status(403).json({ error: "Club admin role required" });
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: `Failed to check club admin permissions: ${error.message}`,
    });
  }
};

export const requireClubAdminForEvent = async (req, res, next) => {
  const { eventID } = req.params;
  const { userID } = req.user;
  try {
    const isClubAdmin = await checkClubAdminPermissionsForEvent(
      parseInt(userID),
      parseInt(eventID)
    );
    if (!isClubAdmin) {
      return res
        .status(403)
        .json({ error: "Club admin role required for this event" });
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: `Failed to check club admin permissions for event: ${error.message}`,
    });
  }
};
