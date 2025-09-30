import React from "react";
import { useSocket } from "@/context/SocketContext";

interface ConnectionStatusProps {
  isJoining?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isJoining = false,
}) => {
  const { isConnected, socketError } = useSocket();

  if (!socketError && isConnected) {
    return null; // Don't show anything when connected successfully
  }

  return (
    <div className="fixed top-4 right-4 z-40 transition-all duration-300 ease-in-out">
      <div
        className={`
        px-3 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm max-w-sm
        ${
          isJoining
            ? "bg-yellow-100/90 text-yellow-800 border border-yellow-200"
            : socketError
            ? "bg-red-100/90 text-red-800 border border-red-200"
            : "bg-red-100/90 text-red-800 border border-red-200"
        }
      `}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`
            w-2 h-2 rounded-full animate-pulse
            ${isJoining ? "bg-yellow-500" : "bg-red-500"}
          `}
          ></div>
          <div className="flex-1">
            <div className="font-medium">
              {isJoining ? "Connecting to chat..." : "Chat disconnected"}
            </div>
            {socketError && (
              <div className="text-xs mt-1 opacity-75">{socketError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
