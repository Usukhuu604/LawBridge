// ====================================================================
//              EXPRESS SERVER - COMPLETE SOCKET.IO IMPLEMENTATION
// ====================================================================

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import OpenAI from "openai";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { Server as SocketIOServer, Socket } from "socket.io";

import { clerkClient, getAuth, clerkMiddleware } from "@clerk/express";
import { verifyToken } from "@clerk/backend";
import { AccessToken } from "livekit-server-sdk";
import { buildContext } from "@/lib/context";

import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import { Context } from "./types/context";
import { Message } from "./models/message.model";
import { chatWithBot, clearChatHistory, getChatStats } from "./lib/langchain";

const schema = makeExecutableSchema({ typeDefs, resolvers });

interface SocketWithAuth extends Socket {
  data: {
    user?: {
      id: string;
      username: string;
      imageUrl: string;
    };
  };
}

const connectedUsers = new Map<string, any>();

async function startServer() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_URL ?? "");
  console.log("✅ MongoDB Connected");

  const app = express();
  const httpServer = createServer(app);

  // CORS Configuration
  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost:3003",
          "http://localhost:3004",
          "http://localhost:3005",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
          "http://127.0.0.1:3002",
          "http://127.0.0.1:3003",
          "http://127.0.0.1:3004",
          "http://127.0.0.1:3005",
          "https://studio.apollographql.com",
          "https://studio.apollographql.com/sandbox/explorer",
          "https://lawbridge-server.onrender.com",
          "https://lawbridge-deploy.vercel.app",
          "https://lawbridge11.vercel.app",
          "https://lawbridge22.vercel.app",
          "https://lawbridge33.vercel.app",
          "https://lawbridge44.vercel.app",
          "https://lawbridge55.vercel.app",
          "https://lawbridge66.vercel.app",
          "https://lawbridge77.vercel.app",
          "https://lawbridge88.vercel.app",
          "https://lawbridge99.vercel.app",
          "https://lawbridge100.vercel.app",
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Allow localhost with any port for development
        if (
          origin.match(/^https?:\/\/localhost:\d+$/) ||
          origin.match(/^https?:\/\/127\.0\.0\.1:\d+$/)
        ) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(clerkMiddleware());
  app.use(express.json());

  // Serve static files from uploads directory
  app.use("/uploads", express.static("uploads"));

  // LiveKit Token Endpoint
  app.post("/api/livekit-token", async (req, res) => {
    console.log("[/api/livekit-token] Request received:", {
      headers: req.headers,
      body: req.body,
    });
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized: User is not signed in." });
      }

      const { room } = req.body;
      if (!room || typeof room !== "string") {
        return res.status(400).json({
          error: "Bad Request: 'room' parameter is missing or invalid.",
        });
      }

      const apiKey = process.env.LIVEKIT_API_KEY;
      const apiSecret = process.env.LIVEKIT_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error(
          "FATAL: LiveKit API credentials are not found in .env file."
        );
        return res.status(500).json({
          error: "Server Configuration Error: LiveKit credentials not set.",
        });
      }

      const at = new AccessToken(apiKey, apiSecret, {
        identity: userId,
        name: userId,
      });
      at.addGrant({
        roomJoin: true,
        room,
        canPublish: true,
        canSubscribe: true,
      });
      const token = await at.toJwt();

      return res.status(200).json({ token });
    } catch (error) {
      console.error("UNEXPECTED ERROR in /api/livekit-token:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // ====================================================================
  //                        CHAT API ENDPOINTS
  // ====================================================================

  // Main Chat Endpoint - Updated to match frontend expectations
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId, options } = req.body;

      // If no explicit userId provided, try to get from Clerk auth
      let finalUserId = userId;
      if (!finalUserId) {
        const { userId: clerkUserId } = getAuth(req);
        finalUserId = clerkUserId;
      }

      if (!message || !finalUserId) {
        return res
          .status(400)
          .json({ error: "Message and userId are required" });
      }

      console.log(`💬 Chat request from user: ${finalUserId}`);
      console.log(`📝 Message: ${message.substring(0, 100)}...`);

      const response = await chatWithBot(message, finalUserId, options || {});

      res.json(response);
    } catch (error) {
      console.error("❌ Chat Error:", error);

      // Send user-friendly error messages
      const errorMessage =
        error instanceof Error ? error.message : "Chatbot failed";
      res.status(500).json({
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Clear Chat History Endpoint
  app.post("/api/chat/clear", async (req, res) => {
    try {
      const { userId } = req.body;

      // If no explicit userId provided, try to get from Clerk auth
      let finalUserId = userId;
      if (!finalUserId) {
        const { userId: clerkUserId } = getAuth(req);
        finalUserId = clerkUserId;
      }

      if (!finalUserId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await clearChatHistory(finalUserId);
      res.json({ success: true, message: "Chat history cleared" });
    } catch (error) {
      console.error("❌ Clear Chat Error:", error);
      res.status(500).json({ error: "Failed to clear chat history" });
    }
  });

  // Chat Statistics Endpoint
  app.get("/api/chat/stats", async (req, res) => {
    try {
      const { userId } = req.query;

      // If no explicit userId provided, try to get from Clerk auth
      let finalUserId = userId as string;
      if (!finalUserId) {
        const { userId: clerkUserId } = getAuth(req);
        finalUserId = clerkUserId || "";
      }

      if (!finalUserId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const stats = await getChatStats(finalUserId);
      res.json(stats);
    } catch (error) {
      console.error("❌ Chat Stats Error:", error);
      res.status(500).json({ error: "Failed to get chat statistics" });
    }
  });

  // Legacy chatbot endpoint (keeping for backward compatibility)
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { question } = req.body;
      const { userId } = getAuth(req);

      if (!question || !userId) {
        return res
          .status(400)
          .json({ error: "Question and userId are required" });
      }

      const response = await chatWithBot(question, userId);
      res.json({ answer: response.answer });
    } catch (error) {
      console.error("Chatbot Error:", error);
      res.status(500).json({ error: "Chatbot failed" });
    }
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  // Socket.IO Server Setup
  const io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
        "https://lawbridge-server.onrender.com",
        "https://studio.apollographql.com/sandbox/explorer",
        "https://lawbridge-deploy.vercel.app",
        "https://lawbridge11.vercel.app",
        "https://lawbridge22.vercel.app",
        "https://lawbridge33.vercel.app",
        "https://lawbridge44.vercel.app",
        "https://lawbridge55.vercel.app",
        "https://lawbridge66.vercel.app",
        "https://lawbridge77.vercel.app",
        "https://lawbridge88.vercel.app",
        "https://lawbridge99.vercel.app",
        "https://lawbridge100.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Helper function to get unique online users
  const getUniqueOnlineUsers = () => {
    const allUsers = Array.from(connectedUsers.values());
    console.log(
      `🔍 All connected users before deduplication:`,
      allUsers.length,
      allUsers.map((u) => ({
        id: u.id,
        username: u.username,
        socketId: u.socketId,
      }))
    );

    const uniqueUsers = allUsers.reduce((acc, user) => {
      if (!acc.find((u) => u.id === user.id)) {
        acc.push(user);
      }
      return acc;
    }, [] as any[]);

    console.log(
      `✅ Unique users after deduplication:`,
      uniqueUsers.length,
      uniqueUsers.map((u) => ({
        id: u.id,
        username: u.username,
        socketId: u.socketId,
      }))
    );
    return uniqueUsers;
  };

  // Socket.IO Authentication Middleware
  io.use(async (socket: SocketWithAuth, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token not provided."));
    }

    try {
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const clerkUser = await clerkClient.users.getUser(decoded.sub);
      socket.data.user = {
        id: clerkUser.id,
        username: clerkUser.username ?? "User",
        imageUrl: clerkUser.imageUrl,
      };
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token."));
    }
  });

  // Socket.IO Connection Handler
  io.on("connection", (socket: SocketWithAuth) => {
    const user = socket.data.user;
    if (!user) return;

    console.log(`⚡ Socket Connected: ${user.username} (ID: ${socket.id})`);

    // Store socket connection
    connectedUsers.set(socket.id, { ...user, socketId: socket.id });
    socket.join(user.id);
    console.log(`➕ Added user ${user.username} with socket ${socket.id}`);

    // Emit online users list (deduplicated by user ID)
    const uniqueUsers = getUniqueOnlineUsers();
    console.log(
      `📤 Emitting ${uniqueUsers.length} unique users to all clients`
    );
    io.emit("onlineUsers", uniqueUsers);

    // Join Chat Room Event
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`🏠 Socket ${socket.id} joined room ${roomId}`);
    });

    // Leave Chat Room Event
    socket.on("leaveRoom", (roomId: string) => {
      socket.leave(roomId);
      console.log(`🚪 Socket ${socket.id} left room ${roomId}`);
    });

    // Send Message Event - Real-time messaging
    socket.on("sendMessage", async ({ roomId, message }) => {
      console.log(`📩 Message received in room ${roomId}:`, message);
      console.log(
        `📩 Full message data:`,
        JSON.stringify({ roomId, message }, null, 2)
      );

      if (!roomId || !message) {
        console.error("❌ Missing roomId or message");
        socket.emit("messageError", { error: "Missing roomId or message" });
        return;
      }

      try {
        console.log(`💾 Attempting to save message to database...`);
        console.log(`💾 Room ID: ${roomId}`);
        console.log(`💾 Message data:`, {
          userId: message.userId,
          type: message.type || "TEXT",
          content: message.content,
          createdAt: new Date().toISOString(),
        });

        // Save message to database
        const savedMessage = await Message.findOneAndUpdate(
          { chatRoomId: roomId },
          {
            $push: {
              ChatRoomsMessages: {
                _id: new mongoose.Types.ObjectId(),
                userId: message.userId,
                type: message.type || "TEXT",
                content: message.content,
                createdAt: new Date().toISOString(),
              },
            },
          },
          { upsert: true, new: true }
        );

        console.log(`💾 Message saved to database:`, savedMessage);
        console.log(
          `💾 Saved message ChatRoomsMessages length:`,
          savedMessage?.ChatRoomsMessages?.length
        );

        // Get the last message ID
        const lastMessage =
          savedMessage.ChatRoomsMessages[
            savedMessage.ChatRoomsMessages.length - 1
          ];
        const messageId =
          (lastMessage as any)._id?.toString() ||
          `${message.userId}-${message.createdAt}`;

        // Broadcast to other users in the room (excluding sender)
        socket.to(roomId).emit("newMessage", {
          ...message,
          fromSelf: false,
          id: messageId,
        });

        // Send back to sender for confirmation (optional)
        socket.emit("newMessage", {
          ...message,
          fromSelf: true,
          id: messageId,
        });

        console.log(`📤 Message broadcasted to room ${roomId}`);
      } catch (error) {
        console.error("❌ Error saving message:", error);
        socket.emit("messageError", { error: "Failed to save message" });
      }
    });

    // Direct Chat Message Event (Alternative to GraphQL)
    socket.on(
      "chat-message",
      async ({ chatRoomId, content, userId, type = "TEXT" }) => {
        console.log(`📩 Direct message received:`, {
          chatRoomId,
          content,
          userId,
          type,
        });

        if (!chatRoomId || !content || !userId) {
          console.error("❌ Missing required fields:", {
            chatRoomId,
            content,
            userId,
          });
          socket.emit("message-error", { error: "Missing required fields" });
          return;
        }

        try {
          // Save message to MongoDB
          const savedMessage = await Message.create({
            chatRoomId,
            content,
            userId,
            type,
            createdAt: new Date(),
          });

          // Populate sender information if your model has sender reference
          const populatedMessage = await Message.findById(savedMessage._id);
          const messageToEmit = populatedMessage || savedMessage;

          console.log(`💾 Message saved:`, messageToEmit);

          // Emit to all clients in the room
          io.to(chatRoomId).emit("message-created", messageToEmit);

          console.log(`📤 Message emitted to room: ${chatRoomId}`);
        } catch (error) {
          console.error("❌ Failed to save or emit message:", error);
          socket.emit("message-error", { error: "Failed to send message" });
        }
      }
    );

    // User Typing Event
    socket.on("typing", ({ chatRoomId, isTyping }) => {
      socket.to(chatRoomId).emit("user-typing", {
        userId: user.id,
        username: user.username,
        isTyping,
      });
    });

    // Disconnect Event
    socket.on("disconnect", () => {
      const disconnectedUser = connectedUsers.get(socket.id);
      if (disconnectedUser) {
        console.log(`❌ Socket Disconnected: ${disconnectedUser.username}`);
        connectedUsers.delete(socket.id);

        // Emit online users list (deduplicated by user ID)
        const uniqueUsers = getUniqueOnlineUsers();
        console.log(
          `📤 Emitting ${uniqueUsers.length} unique users after disconnect`
        );
        io.emit("onlineUsers", uniqueUsers);
      }
    });
  });

  // Apollo Server Setup
  const apolloServer = new ApolloServer<Context>({
    schema,
    introspection: true,
  });
  await apolloServer.start();

  // GraphQL Endpoint with Socket.IO in context
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {

      context: async ({ req }) => {
        try {
          const context = await buildContext(req);
          return {
            ...context,
            io: io, // Pass your Socket.IO instance
          };
        } catch (error) {
          console.error("Error creating context:", error);
          return {
            req,
            db: mongoose.connection.db,
            io: io,
          };
        }
      },
    })
  );

  // Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        mongodb:
          mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        socketio: "running",
        graphql: "running",
      },
    });
  });

  // Start Server
  const PORT = Number(process.env.PORT) || 4000;
  httpServer.listen(PORT, () => {
    console.log("======================================================");
    console.log(`✅ Express Server listening on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL ready at POST /graphql`);
    console.log(`💬 Socket.IO ready at path /socket.io`);
    console.log(`🎥 LiveKit Token endpoint ready at POST /api/livekit-token`);
    console.log(`💬 Chat API endpoints ready:`);
    console.log(`   - POST /api/chat (main chat)`);
    console.log(`   - POST /api/chat/clear (clear history)`);
    console.log(`   - GET /api/chat/stats (chat statistics)`);
    console.log(`   - GET /api/health (health check)`);
    console.log("======================================================");
  });
}

startServer().catch((err) => {
  console.error("❌ Fatal server startup error:", err);
  process.exit(1);
});
