import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Import and use match routes
import { matchRouter } from "./routes/match.route.js";
app.use("/matches", matchRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
