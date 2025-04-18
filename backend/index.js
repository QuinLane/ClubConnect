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
import venueRoutes from "./routes/venues.js";
import userRoutes from "./routes/users.js";
import clubsRoutes from "./routes/clubs.js"
// Load environment variables
dotenv.config();

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

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/executives", executiveRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/users", userRoutes);
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
