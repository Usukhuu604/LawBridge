import React from "react";
import { Message } from "@/app/chatroom/types/chat";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

export const MessageBubble: React.FC<{
  message: Message;
  isOwnMessage: boolean;
  otherUserAvatar?: string;
}> = ({ message, isOwnMessage, otherUserAvatar }) => {
  const formatTime = (timestamp: Date | string) => {
    if (!timestamp) return "";
    try {
      const dateObject = new Date(timestamp);
      if (isNaN(dateObject.getTime())) return "";
      return dateObject.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "IMAGE":
        return (
          <img
            src={message.content}
            alt="image"
            className="rounded-lg max-w-xs h-auto"
          />
        );
      case "FILE":
        return (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border hover:bg-slate-100"
          >
            <div className="p-2 bg-gray-100 rounded">
              <Download className="w-5 h-5 text-primary-custom" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-800">
                Download File
              </p>
            </div>
          </a>
        );
      default:
        return (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        );
    }
  };

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar for other user, use actual profile picture or fallback to generic avatar */}
      {!isOwnMessage && (
        <div className="w-8 h-8 rounded-full mb-4 flex-shrink-0 overflow-hidden">
          {otherUserAvatar ? (
            <img
              src={otherUserAvatar}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-white font-bold">
              <span>U</span>
            </div>
          )}
        </div>
      )}
      <div>
        <div
          className={cn(
            "max-w-[75vw] sm:max-w-xs lg:max-w-md rounded-2xl px-3 py-2 text-sm md:text-base shadow-sm",
            isOwnMessage
              ? "bg-primary-custom text-white rounded-br-none"
              : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
          )}
        >
          {renderMessageContent()}
        </div>
        <div
          className={cn(
            "text-xs text-slate-400 mt-1 px-1",
            isOwnMessage ? "text-right" : "text-left"
          )}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};
