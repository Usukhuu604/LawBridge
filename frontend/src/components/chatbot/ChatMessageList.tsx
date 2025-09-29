import React, { useRef, useEffect } from "react";
import ChatMessageBubble from "./ChatMessageBubble";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isError?: boolean;
}

interface ChatMessageListProps {
  messages: Message[];
  userId: string;
  userAvatarUrl?: string;
  isLoading?: boolean; // Add isLoading prop
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  userId,
  userAvatarUrl,
  isLoading = false, // Default to false
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!messages.length) return null;
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-white">
      {messages.map((msg, index) => (
        <div
          key={`${msg.sender}-${msg.timestamp.getTime()}-${index}`}
          className="animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ChatMessageBubble
            message={msg}
            isOwnMessage={msg.sender === "user" && userId !== undefined}
            userAvatarUrl={msg.sender === "user" ? userAvatarUrl : undefined}
          />
        </div>
      ))}
      {isLoading && (
        <div className="flex w-full items-start gap-3 justify-start animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center shadow-lg">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
          <div>
            <div className="prose prose-sm max-w-[80vw] sm:max-w-lg rounded-2xl px-5 py-4 shadow-lg bg-white/95 backdrop-blur-sm text-[#003366] border-2 border-[#003366]/10 rounded-bl-sm">
              <span className="inline-block">
                <span className="typing-dot inline-block w-2 h-2 bg-[#003366]/60 rounded-full mr-1"></span>
                <span className="typing-dot inline-block w-2 h-2 bg-[#003366]/60 rounded-full mr-1"></span>
                <span className="typing-dot inline-block w-2 h-2 bg-[#003366]/60 rounded-full"></span>
              </span>
            </div>
            <div className="text-xs text-[#003366]/60 mt-2 px-1 text-left">
              AI бодож байна...
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default ChatMessageList;
