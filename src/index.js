import express from "express";
import http from "http";
// Import and use match routes
import { matchRouter } from "./routes/match.route.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();

const server = http.createServer(app);

app.use(express.json());

app.use(securityMiddleware());

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `Websocket server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
