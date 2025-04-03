import express from "express";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ClubHub Backend is running!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
