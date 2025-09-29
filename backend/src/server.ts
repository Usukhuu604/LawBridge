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

import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import { Context } from "./types/context";
import { Message } from "./models/message.model";
import { chatWithBot, clearChatHistory, getChatStats } from "./lib/langchain";
import { buildContext } from "./lib/context";

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

  // CORS Configuration - Allow all origins
  app.use(
    cors({
      origin: "*",
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
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

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

    // Add user to connected users map
    connectedUsers.set(socket.id, { ...user, socketId: socket.id });
    socket.join(user.id);

    // Emit online users list
    io.emit("onlineUsers", Array.from(connectedUsers.values()));

    // Join Chat Room Event
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`🏠 Socket ${socket.id} joined room ${roomId}`);
    });

    // Leave Chat Room Event
    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`🚪 Socket ${socket.id} left room ${roomId}`);
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
        io.emit("onlineUsers", Array.from(connectedUsers.values()));
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
      context: async ({ req }) => await buildContext(req),
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
