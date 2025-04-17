import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import executiveRoutes from "./routes/executives.js";
import eventRoutes from "./routes/events.js";
import rsvpRoutes from "./routes/rsvps.js";
import formRoutes from "./routes/forms.js";
import announcementRoutes from "./routes/announcements.js";
import messageRoutes from "./routes/messages.js";

// Load environment variables
dotenv.config();

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/executives", executiveRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/messages", messageRoutes);

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
