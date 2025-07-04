import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import executiveRoutes from "./routes/executives.js";
import eventRoutes from "./routes/events.js";
import rsvpRoutes from "./routes/rsvps.js";
import formRoutes from "./routes/forms.js";
import venueRoutes from "./routes/venues.js";
import userRoutes from "./routes/users.js";
import suMessageRoutes from "./routes/suMessages.js";
import notificationRoutes from "./routes/notifications.js";
import suRoutes from "./routes/su.js";
import clubsRoutes from "./routes/clubs.js";
// // Load environment variables
// dotenv.config();
import fileUpload from "express-fileupload";

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5050;

const corsOptions = {
  origin: "http://localhost:5173", // Your frontend’s origin
  credentials: true, // Allow cookies, tokens, etc.
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(
  fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 }, //1MB Limit
    abortOnLimit: true, //stop if file exceeds size limit
  })
);

app.use(express.json());

// Routes
app.use("/api/executives", executiveRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/su-messages", suMessageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/su", suRoutes);
app.use("/api/clubs", clubsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("ClubHub Backend is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
