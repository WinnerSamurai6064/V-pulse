import express from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "5mb" }));

const wss = new WebSocketServer({ server });

const sockets = new Map();
const users = new Map();
const messages = [];
const posts = [
  {
    id: "post_1",
    authorId: "system_pulse",
    author: "cyber_vibe",
    avatar: "",
    caption: "Welcome to the future of social.",
    imageUrl: "",
    likes: 0,
    likedBy: [],
    bookmarkedBy: [],
    createdAt: new Date().toISOString(),
  },
];

function now() {
  return new Date().toISOString();
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function safeText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    active: user.active,
    lastSeen: user.lastSeen,
  };
}

function send(ws, payload) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcast(payload, exceptWs = null) {
  for (const client of wss.clients) {
    if (client !== exceptWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}

function getOnlineUsers() {
  return Array.from(users.values())
    .filter((user) => user.active)
    .map(publicUser);
}

function getState() {
  return {
    ok: true,
    app: "V-PULSE",
    realtime: true,
    users: getOnlineUsers(),
    posts,
    messages: messages.slice(-50),
  };
}

wss.on("connection", (ws) => {
  const userId = makeId("user");

  const defaultUser = {
    id: userId,
    username: "guest_pulse",
    displayName: "Guest Pulse",
    avatar: "",
    active: true,
    lastSeen: now(),
    createdAt: now(),
  };

  sockets.set(userId, ws);
  users.set(userId, defaultUser);

  send(ws, {
    type: "connected",
    userId,
    state: getState(),
    message: "Connected to V-PULSE realtime server",
  });

  broadcast(
    {
      type: "presence:update",
      user: publicUser(defaultUser),
      users: getOnlineUsers(),
    },
    ws
  );

  ws.on("message", (raw) => {
    let data;

    try {
      data = JSON.parse(raw.toString());
    } catch {
      send(ws, {
        type: "error",
        message: "Invalid JSON message",
      });
      return;
    }

    if (!data || typeof data.type !== "string") {
      send(ws, {
        type: "error",
        message: "Missing event type",
      });
      return;
    }

    const currentUser = users.get(userId);

    if (!currentUser) {
      send(ws, {
        type: "error",
        message: "User session not found",
      });
      return;
    }

    switch (data.type) {
      case "auth:login":
      case "auth:guest": {
        const username =
          safeText(data.username, "guest_pulse")
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, "")
            .slice(0, 24) || "guest_pulse";

        const displayName =
          safeText(data.displayName, username).slice(0, 40) || username;

        const updatedUser = {
          ...currentUser,
          username,
          displayName,
          avatar: safeText(data.avatar, ""),
          active: true,
          lastSeen: now(),
        };

        users.set(userId, updatedUser);

        send(ws, {
          type: "auth:success",
          user: publicUser(updatedUser),
          state: getState(),
        });

        broadcast({
          type: "presence:update",
          user: publicUser(updatedUser),
          users: getOnlineUsers(),
        });

        break;
      }

      case "message:send": {
        const text = safeText(data.text);

        if (!text) {
          send(ws, {
            type: "error",
            message: "Message cannot be empty",
          });
          return;
        }

        const message = {
          id: makeId("msg"),
          from: userId,
          fromUsername: currentUser.username,
          to: safeText(data.to, "global"),
          text: text.slice(0, 1000),
          createdAt: now(),
          read: false,
        };

        messages.push(message);

        const payload = {
          type: "message:new",
          message,
        };

        broadcast(payload);
        send(ws, payload);

        break;
      }

      case "typing:start": {
        broadcast(
          {
            type: "typing:start",
            from: userId,
            fromUsername: currentUser.username,
            to: safeText(data.to, "global"),
          },
          ws
        );
        break;
      }

      case "typing:stop": {
        broadcast(
          {
            type: "typing:stop",
            from: userId,
            fromUsername: currentUser.username,
            to: safeText(data.to, "global"),
          },
          ws
        );
        break;
      }

      case "post:create": {
        const caption = safeText(data.caption).slice(0, 2200);
        const imageUrl = safeText(data.imageUrl);

        if (!caption && !imageUrl) {
          send(ws, {
            type: "error",
            message: "Post needs a caption or image",
          });
          return;
        }

        const post = {
          id: makeId("post"),
          authorId: userId,
          author: currentUser.username,
          avatar: currentUser.avatar,
          caption,
          imageUrl,
          likes: 0,
          likedBy: [],
          bookmarkedBy: [],
          createdAt: now(),
        };

        posts.unshift(post);

        broadcast({
          type: "post:new",
          post,
          posts,
        });

        break;
      }

      case "post:like": {
        const postId = safeText(data.postId);
        const post = posts.find((item) => item.id === postId);

        if (!post) {
          send(ws, {
            type: "error",
            message: "Post not found",
          });
          return;
        }

        const alreadyLiked = post.likedBy.includes(userId);

        if (alreadyLiked) {
          post.likedBy = post.likedBy.filter((id) => id !== userId);
        } else {
          post.likedBy.push(userId);
        }

        post.likes = post.likedBy.length;

        broadcast({
          type: "post:liked",
          postId,
          likes: post.likes,
          liked: !alreadyLiked,
          userId,
          posts,
        });

        break;
      }

      case "post:bookmark": {
        const postId = safeText(data.postId);
        const post = posts.find((item) => item.id === postId);

        if (!post) {
          send(ws, {
            type: "error",
            message: "Post not found",
          });
          return;
        }

        const alreadyBookmarked = post.bookmarkedBy.includes(userId);

        if (alreadyBookmarked) {
          post.bookmarkedBy = post.bookmarkedBy.filter((id) => id !== userId);
        } else {
          post.bookmarkedBy.push(userId);
        }

        send(ws, {
          type: "post:bookmarked",
          postId,
          bookmarked: !alreadyBookmarked,
          posts,
        });

        break;
      }

      case "post:edit": {
        const postId = safeText(data.postId);
        const post = posts.find((item) => item.id === postId);

        if (!post) {
          send(ws, {
            type: "error",
            message: "Post not found",
          });
          return;
        }

        if (post.authorId !== userId) {
          send(ws, {
            type: "error",
            message: "You can only edit your own post",
          });
          return;
        }

        post.caption = safeText(data.caption, post.caption).slice(0, 2200);
        post.editedAt = now();

        broadcast({
          type: "post:edited",
          post,
          posts,
        });

        break;
      }

      case "post:delete": {
        const postId = safeText(data.postId);
        const index = posts.findIndex((item) => item.id === postId);

        if (index === -1) {
          send(ws, {
            type: "error",
            message: "Post not found",
          });
          return;
        }

        if (posts[index].authorId !== userId) {
          send(ws, {
            type: "error",
            message: "You can only delete your own post",
          });
          return;
        }

        const deletedPost = posts.splice(index, 1)[0];

        broadcast({
          type: "post:deleted",
          postId: deletedPost.id,
          posts,
        });

        break;
      }

      case "state:get": {
        send(ws, {
          type: "state:update",
          state: getState(),
        });

        break;
      }

      case "session:end": {
        const updatedUser = {
          ...currentUser,
          active: false,
          lastSeen: now(),
        };

        users.set(userId, updatedUser);

        send(ws, {
          type: "session:ended",
        });

        broadcast({
          type: "presence:update",
          user: publicUser(updatedUser),
          users: getOnlineUsers(),
        });

        ws.close();
        break;
      }

      default: {
        send(ws, {
          type: "error",
          message: `Unknown event type: ${data.type}`,
        });
      }
    }
  });

  ws.on("close", () => {
    const user = users.get(userId);

    if (user) {
      users.set(userId, {
        ...user,
        active: false,
        lastSeen: now(),
      });
    }

    sockets.delete(userId);

    broadcast({
      type: "presence:update",
      userId,
      active: false,
      users: getOnlineUsers(),
    });
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    app: "V-PULSE",
    realtime: true,
    uptime: process.uptime(),
  });
});

app.get("/api/state", (req, res) => {
  res.json(getState());
});

const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

if (fs.existsSync(indexPath)) {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get("*", (req, res) => {
    res.status(200).send(`
      <html>
        <head>
          <title>V-PULSE Server</title>
          <style>
            body {
              background: #000;
              color: #fff;
              font-family: Arial, sans-serif;
              display: flex;
              min-height: 100vh;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            h1 {
              color: #ff5a00;
              letter-spacing: 0.08em;
            }
            code {
              background: #16161c;
              padding: 4px 8px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <main>
            <h1>V-PULSE SERVER ACTIVE</h1>
            <p>Realtime WebSocket server is running.</p>
            <p>Build the frontend with <code>npm run build</code> to serve the app here.</p>
          </main>
        </body>
      </html>
    `);
  });
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`V-PULSE server running on http://0.0.0.0:${PORT}`);
});
