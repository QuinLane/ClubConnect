import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/users.js";
import clubRoutes from "./routes/clubs.js";

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);

app.get("/", (req, res) => {
  res.send("ClubHub Backend is running!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
