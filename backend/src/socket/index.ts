// src/socket/index.ts
import { Server, Socket } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { clerkClient } from "@clerk/express";
import { userManager, OnlineUser } from "./user-manager";
import { SOCKET_EVENTS, AUTH_ERROR } from "./contants";
import { Message as MessageModel } from "@/models/message.model";

// Socket-д user data хадгалах интерфейс
interface SocketWithAuth extends Socket {
  data: {
    user?: Omit<OnlineUser, "socketId">;
  };
}

export function initializeSocketIO(io: Server) {
  // --- Authentication Middleware ---
  io.use(async (socket: SocketWithAuth, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error(`${AUTH_ERROR}: Token not provided.`));
    }

    try {
      const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
      const clerkUser = await clerkClient.users.getUser(decoded.sub);

      // Socket-д хэрэглэгчийн мэдээллийг хавсаргах
      socket.data.user = {
        id: clerkUser.id,
        username: clerkUser.username ?? clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName ?? undefined,
        lastName: clerkUser.lastName ?? undefined,
        imageUrl: clerkUser.imageUrl,
      };
      next();
    } catch (err) {
      console.error("❌ Socket Authentication Failed:", (err as Error).message);
      return next(new Error(`${AUTH_ERROR}: Invalid token.`));
    }
  });

  // --- Main Connection Handler ---
  io.on(SOCKET_EVENTS.CLIENT_CONNECT, (socket: SocketWithAuth) => {
    const user = socket.data.user;
    if (!user) return;

    console.log(`⚡ User connected: ${user.username} (Socket: ${socket.id})`);
    userManager.addUser({ ...user, socketId: socket.id });

    // Хэрэглэгчийн ID-р room-д join хийх (private room)
    socket.join(user.id);

    // Онлайн хэрэглэгчдийн жагсаалтыг broadcast хийх
    io.emit(SOCKET_EVENTS.SERVER_UPDATE_ONLINE_USERS, userManager.getOnlineUsers());

    // --- Socket Event Listeners ---

    // Chat message авах ба хадгалах, илгээх
    socket.on("chat-message", async ({ chatRoomId, toUserId, content, type = "TEXT" }) => {
      if (!socket.data.user) return;

      try {
        // Мессежийг MongoDB-д хадгалах
        const saved = await MessageModel.create({
          chatRoomId,
          userId: socket.data.user.id,
          content,
          type,
        });

        // Хүлээн авагч руу мессеж илгээх
        io.to(toUserId).emit("chat-message", {
          id: saved._id.toString(),
          chatRoomId: saved.chatRoomId.toString(),
          content: saved.content,
          type: saved.type,
          from: {
            id: socket.data.user.id,
            username: socket.data.user.username,
            avatar: socket.data.user.imageUrl,
          },
        });
      } catch (err) {
        console.error("❌ Error saving message:", err);
      }
    });

    // Typing indicator - эхэлсэн
    socket.on(SOCKET_EVENTS.CLIENT_START_TYPING, (chatRoomId) => {
      socket.to(chatRoomId).emit(SOCKET_EVENTS.SERVER_USER_IS_TYPING, {
        chatRoomId,
        user,
      });
    });

    // Typing indicator - зогссон
    socket.on(SOCKET_EVENTS.CLIENT_STOP_TYPING, (chatRoomId) => {
      socket.to(chatRoomId).emit(SOCKET_EVENTS.SERVER_USER_STOPPED_TYPING, {
        chatRoomId,
        user,
      });
    });

    // Socket disconnect үед
    socket.on(SOCKET_EVENTS.CLIENT_DISCONNECT, () => {
      const disconnectedUser = userManager.removeUser(socket.id);
      if (disconnectedUser) {
        console.log(`❌ User disconnected: ${disconnectedUser.username} (Socket: ${socket.id})`);
        io.emit(SOCKET_EVENTS.SERVER_UPDATE_ONLINE_USERS, userManager.getOnlineUsers());
      }
    });
  });
}
