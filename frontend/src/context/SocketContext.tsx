"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
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
  socketError: string | null;
  sendMessage: (data: {
    chatRoomId: string;
    content: string;
    userId: string;
    type?: string;
  }) => void;
  joinRoom: (chatRoomId: string) => void;
  leaveRoom: (chatRoomId: string) => void;
  emitTyping: (data: { chatRoomId: string; isTyping: boolean }) => void;
  onMessage: (callback: (message: any) => void) => void;
  offMessage: (callback: (message: any) => void) => void;
  onTyping: (callback: (data: any) => void) => void;
  offTyping: (callback: (data: any) => void) => void;
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
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const connectSocket = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No authentication token available");
          return;
        }

        // Only create new socket if we don't have one or it's disconnected
        if (!socket || !socket.connected) {
          const serverUrl =
            process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";
          console.log(
            "🔌 Attempting to connect to Socket.IO server:",
            serverUrl
          );

          const newSocket = io(serverUrl, {
            path: "/socket.io",
            auth: {
              token: token,
            },
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionAttempts: 3,
            timeout: 10000,
          });

          // Connection events
          newSocket.on("connect", () => {
            console.log("✅ Socket.IO connected successfully");
            setIsConnected(true);
          });

          newSocket.on("disconnect", (reason) => {
            console.log("🔌 Socket.IO disconnected:", reason);
            setIsConnected(false);
          });

          newSocket.on("connect_error", (error) => {
            console.error("❌ Socket.IO connection error:", error);
            console.error(
              "❌ This usually means the Socket.IO server is not running at:",
              serverUrl
            );
            setSocketError(
              `Cannot connect to Socket.IO server at ${serverUrl}. Please ensure the server is running.`
            );
            setIsConnected(false);
          });

          newSocket.on("reconnect", (attemptNumber) => {
            console.log(
              "🔄 Socket.IO reconnected after",
              attemptNumber,
              "attempts"
            );
            setIsConnected(true);
          });

          newSocket.on("reconnect_error", (error) => {
            console.error("❌ Socket.IO reconnection error:", error);
          });

          newSocket.on("reconnect_failed", () => {
            console.error(
              "❌ Socket.IO reconnection failed after all attempts"
            );
            setIsConnected(false);
          });

          // Online users
          newSocket.on("onlineUsers", (users: User[]) => {
            // Deduplicate users by ID on the frontend as well
            const uniqueUsers = users.reduce((acc, user) => {
              if (!acc.find((u) => u.id === user.id)) {
                acc.push(user);
              }
              return acc;
            }, [] as User[]);
            setOnlineUsers(uniqueUsers);
          });

          // Error handling
          newSocket.on("message-error", (error) => {
            console.error("❌ Message error:", error);
          });

          setSocket(newSocket);
        }
      } catch (error) {
        console.error("Failed to connect socket:", error);
      }
    };

    connectSocket();

    return () => {
      // Only disconnect on unmount, not on every dependency change
      if (socket && !isLoaded) {
        socket.disconnect();
      }
    };
  }, [isLoaded, user]); // Removed getToken from dependencies to prevent reconnections

  // Socket utility functions
  const sendMessage = useCallback(
    (data: {
      chatRoomId: string;
      content: string;
      userId: string;
      type?: string;
    }) => {
      if (socket && isConnected) {
        const messageData = {
          roomId: data.chatRoomId,
          message: {
            userId: data.userId,
            content: data.content,
            type: data.type || "TEXT",
            createdAt: new Date().toISOString(),
          },
        };
        socket.emit("sendMessage", messageData);
      } else {
        console.warn("⚠️ Cannot send message: Socket not connected");
      }
    },
    [socket, isConnected]
  );

  const joinRoom = useCallback(
    (chatRoomId: string) => {
      if (socket && isConnected) {
        socket.emit("joinRoom", chatRoomId);
      } else {
        console.warn("⚠️ Cannot join room: Socket not connected");
      }
    },
    [socket, isConnected]
  );

  const leaveRoom = useCallback(
    (chatRoomId: string) => {
      if (socket && isConnected) {
        socket.emit("leaveRoom", chatRoomId);
      } else {
        console.warn("⚠️ Cannot leave room: Socket not connected");
      }
    },
    [socket, isConnected]
  );

  const emitTyping = useCallback(
    (data: { chatRoomId: string; isTyping: boolean }) => {
      if (socket && isConnected) {
        socket.emit("typing", data);
      } else {
        console.warn("⚠️ Cannot emit typing: Socket not connected");
      }
    },
    [socket, isConnected]
  );

  // Event listener helpers
  const onMessage = useCallback(
    (callback: (message: any) => void) => {
      if (socket) {
        socket.on("newMessage", callback);
      }
    },
    [socket]
  );

  const offMessage = useCallback(
    (callback: (message: any) => void) => {
      if (socket) {
        socket.off("newMessage", callback);
      }
    },
    [socket]
  );

  const onTyping = useCallback(
    (callback: (data: any) => void) => {
      if (socket) {
        socket.on("user-typing", callback);
      }
    },
    [socket]
  );

  const offTyping = useCallback(
    (callback: (data: any) => void) => {
      if (socket) {
        socket.off("user-typing", callback);
      }
    },
    [socket]
  );

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    socketError,
    sendMessage,
    joinRoom,
    leaveRoom,
    emitTyping,
    onMessage,
    offMessage,
    onTyping,
    offTyping,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
