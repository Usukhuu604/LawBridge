"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  username: string;
  imageUrl: string;
  socketId: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: User[];
  connectionError: string | null;
  sendMessage: (data: {
    chatRoomId: "685a1b9dff6157ee051ccaaa";
    content: string;
    userId: string;
    type?: string;
  }) => void;
  joinRoom: (chatRoomId: string) => void;
  leaveRoom: (chatRoomId: string) => void;
  emitTyping: (data: { chatRoomId: string; isTyping: boolean }) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const connectSocket = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No authentication token available");
          return;
        }

        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_URL ||
          "https://lawbridge-server.onrender.com";
        console.log("🔌 Attempting to connect to:", serverUrl);

        const newSocket = io(serverUrl, {
          path: "/socket.io",
          auth: {
            token: token,
          },
          transports: ["websocket", "polling"],
          timeout: 10000, // 10 second timeout
          forceNew: true, // Force new connection
          reconnection: true,
          reconnectionAttempts: 5, // Increased attempts
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000, // Max delay between attempts
        });

        // Connection events
        newSocket.on("connect", () => {
          console.log("✅ Socket connected:", newSocket.id);
          setIsConnected(true);
          setConnectionError(null);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setIsConnected(false);
        });

        newSocket.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error);
          setIsConnected(false);
          setConnectionError(error.message || "Connection failed");
        });

        // Online users
        newSocket.on("onlineUsers", (users: User[]) => {
          console.log("👥 Online users updated:", users);
          setOnlineUsers(users);
        });

        // Error handling
        newSocket.on("message-error", (error) => {
          console.error("❌ Message error:", error);
        });

        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to connect socket:", error);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        console.log("🔌 Disconnecting socket...");
        socket.disconnect();
      }
    };
  }, [isLoaded, user, getToken]);

  // Socket utility functions
  const sendMessage = (data: {
    chatRoomId: string;
    content: string;
    userId: string;
    type?: string;
  }) => {
    if (socket && isConnected) {
      console.log("📤 Sending message:", data);
      socket.emit("chat-message", data);
    } else {
      console.warn("⚠️ Socket not connected, cannot send message");
    }
  };

  const joinRoom = (chatRoomId: string) => {
    if (socket && isConnected) {
      console.log("🏠 Joining room:", chatRoomId);
      socket.emit("join-room", chatRoomId);
    }
  };

  const leaveRoom = (chatRoomId: string) => {
    if (socket && isConnected) {
      console.log("🚪 Leaving room:", chatRoomId);
      socket.emit("leave-room", chatRoomId);
    }
  };

  const emitTyping = (data: { chatRoomId: string; isTyping: boolean }) => {
    if (socket && isConnected) {
      socket.emit("typing", data);
    }
  };

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    joinRoom,
    leaveRoom,
    emitTyping,
    connectionError,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
