import WebSocket from "ws";
import { logger } from "../utils/logger.js";

class WebSocketService {
  constructor() {
    this.connections = new Map();
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws, req) => {
      const userId = req.user?.id;
      if (!userId) {
        ws.close();
        return;
      }

      this.connections.set(userId, ws);

      ws.on("close", () => {
        this.connections.delete(userId);
      });

      ws.on("error", (error) => {
        logger.error("WebSocket error", error);
        this.connections.delete(userId);
      });
    });
  }

  sendNotification(userId, notification) {
    const connection = this.connections.get(userId);
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(notification));
    }
  }

  broadcastNotification(notification) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  }
}

export const websocketService = new WebSocketService();
