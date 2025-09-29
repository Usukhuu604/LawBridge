// / src/hkoos / useSocket.ts;

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/nextjs"; // Or your auth hook

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        // Get auth token
        const token = await getToken();
        if (!token) {
          setError("No authentication token available");
          return;
        }

        // Create socket connection
        const newSocket = io("https://lawbridge-server.onrender.com", {
          path: "/socket.io",
          auth: {
            token: token,
          },
          transports: ["websocket", "polling"],
        });

        // Socket event listeners
        newSocket.on("connect", () => {
          console.log("✅ Socket connected:", newSocket.id);
          setIsConnected(true);
          setError(null);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
          console.error("❌ Socket connection error:", err);
          setError(err.message);
          setIsConnected(false);
        });

        // Store socket
        socketRef.current = newSocket;
        setSocket(newSocket);
      } catch (err) {
        console.error("❌ Error initializing socket:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [getToken]);

  return {
    socket,
    isConnected,
    error,
  };
};
