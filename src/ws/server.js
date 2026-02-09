import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

export const sendJson = (socket, payload) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
};

export const broadcast = (wss, payload) => {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
};

export const attachWebSocketServer = (server) => {
  const wss = new WebSocketServer({
    server: server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    sendJson(socket, { type: "welcome" });
    if (wsArcjet) {
      try {
        const decision = wsArcjet.protect(socket);
        if (decision.isDenied()) {
          if (decision.reason.isRateLimit()) {
            sendJson(socket, { type: "error", error: "Rate limit exceeded" });
          } else {
            sendJson(socket, { type: "error", error: "Forbidden" });
          }
          socket.close(1008, "Policy violation");
          return;
        }
      } catch (error) {
        console.error("WS connection error", error);
        socket.close(1011, "Server security error");
        return;
      }
    }
    socket.on("error", console.error);
  });

  const broadcastMatchCreated = (match) => {
    broadcast(wss, { type: "match_created", data: match });
  };

  return { broadcastMatchCreated };
};
