import { WebSocket, WebSocketServer } from "ws";

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
    socket.on("error", console.error);
  });

  const broadcastMatchCreated = (match) => {
    broadcast(wss, { type: "match_created", data: match });
  };

  return { broadcastMatchCreated };
};
