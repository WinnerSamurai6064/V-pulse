// server.js
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());

const wss = new WebSocketServer({ server });

const users = new Map();

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcast(payload, exceptWs = null) {
  for (const client of wss.clients) {
    if (client !== exceptWs && client.readyState === client.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}

wss.on("connection", (ws) => {
  const userId = `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  users.set(userId, {
    id: userId,
    username: "guest_pulse",
    active: true
  });

  send(ws, {
    type: "connected",
    userId,
    message: "Connected to V-PULSE realtime server"
  });

  broadcast({
    type: "presence:update",
    userId,
    active: true
  }, ws);

  ws.on("message", (raw) => {
    let data;

    try {
      data = JSON.parse(raw.toString());
    } catch {
      send(ws, {
        type: "error",
        message: "Invalid JSON message"
      });
      return;
    }

    switch (data.type) {
      case "auth:login": {
        const user = users.get(userId);
        user.username = data.username || "guest_pulse";
        users.set(userId, user);

        send(ws, {
          type: "auth:success",
          user
        });

        broadcast({
          type: "presence:update",
          userId,
          username: user.username,
          active: true
        });

        break;
      }

      case "message:send": {
        const payload = {
          type: "message:new",
          id: Date.now(),
          from: data.from || userId,
          to: data.to || "global",
          text: data.text,
          createdAt: new Date().toISOString()
        };

        broadcast(payload);
        send(ws, payload);
        break;
      }

      case "typing:start": {
        broadcast({
          type: "typing:start",
          from: data.from || userId,
          to: data.to
        }, ws);
        break;
      }

      case "typing:stop": {
        broadcast({
          type: "typing:stop",
          from: data.from || userId,
          to: data.to
        }, ws);
        break;
      }

      case "post:like": {
        broadcast({
          type: "post:liked",
          postId: data.postId,
          userId
        });
        break;
      }

      case "post:bookmark": {
        send(ws, {
          type: "post:bookmarked",
          postId: data.postId,
          userId
        });
        break;
      }

      case "post:create": {
        broadcast({
          type: "post:new",
          post: {
            id: Date.now(),
            author: data.author || "guest_pulse",
            caption: data.caption || "",
            imageUrl: data.imageUrl || "",
            createdAt: new Date().toISOString()
          }
        });
        break;
      }

      case "session:end": {
        send(ws, {
          type: "session:ended"
        });
        ws.close();
        break;
      }

      default: {
        send(ws, {
          type: "error",
          message: `Unknown event type: ${data.type}`
        });
      }
    }
  });

  ws.on("close", () => {
    users.delete(userId);

    broadcast({
      type: "presence:update",
      userId,
      active: false
    });
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    app: "V-PULSE",
    realtime: true
  });
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`V-PULSE server running on http://0.0.0.0:${PORT}`);
});
