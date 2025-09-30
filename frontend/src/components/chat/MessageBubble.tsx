import React from "react";
import { cn } from "@/lib/utils";
import {
  Download,
  File,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
} from "lucide-react";

interface Message {
  id: string;
  chatRoomId: string;
  userId: string;
  type: "TEXT" | "IMAGE" | "FILE";
  content: string;
  createdAt: string;
  fileName?: string;
  fileSize?: number;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  otherUserAvatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ message, isOwnMessage, otherUserAvatar }) => {
    const getFileIcon = (fileName: string) => {
      const extension = fileName.split(".").pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
        return <ImageIcon className="w-5 h-5" />;
      }
      if (["mp4", "webm", "mov", "avi"].includes(extension || "")) {
        return <Video className="w-5 h-5" />;
      }
      if (["mp3", "wav", "ogg", "m4a"].includes(extension || "")) {
        return <Music className="w-5 h-5" />;
      }
      if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
        return <FileText className="w-5 h-5" />;
      }
      return <File className="w-5 h-5" />;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileName = (url: string) => {
      // Extract filename from URL
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      return fileName || "Unknown file";
    };

    const renderMessageContent = () => {
      switch (message.type) {
        case "IMAGE":
          return (
            <div className="space-y-2">
              <img
                src={message.content}
                alt="image"
                className="rounded-lg max-w-xs h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.content, "_blank")}
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = "/default-image.svg";
                }}
              />
              {message.fileName && (
                <p className="text-xs text-gray-500 truncate">
                  {message.fileName}
                </p>
              )}
            </div>
          );
        case "FILE":
          const fileName = message.fileName || getFileName(message.content);
          const fileSize = message.fileSize;

          return (
            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                isOwnMessage
                  ? "bg-white/20 hover:bg-white/30 border-white/30"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  isOwnMessage ? "bg-white/20" : "bg-blue-100"
                }`}
              >
                {getFileIcon(fileName)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm truncate ${
                    isOwnMessage ? "text-white" : "text-slate-800"
                  }`}
                >
                  {fileName}
                </p>
                {fileSize && (
                  <p
                    className={`text-xs ${
                      isOwnMessage ? "text-white/70" : "text-slate-500"
                    }`}
                  >
                    {formatFileSize(fileSize)}
                  </p>
                )}
                <div className="flex items-center space-x-1 mt-1">
                  <Download
                    className={`w-3 h-3 ${
                      isOwnMessage ? "text-white/70" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isOwnMessage ? "text-white/70" : "text-blue-600"
                    }`}
                  >
                    Download
                  </span>
                </div>
              </div>
            </a>
          );
        default:
          return (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          );
      }
    };

    const formatTime = (timestamp: string) => {
      try {
        return new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "12:00";
      }
    };

    return (
      <div
        className={cn(
          "flex w-full items-end gap-2 mb-4",
          isOwnMessage ? "justify-end" : "justify-start"
        )}
      >
        {!isOwnMessage && (
          <div className="w-10 h-10 rounded-full mb-4 flex-shrink-0 overflow-hidden border-2 border-gray-200">
            {otherUserAvatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${otherUserAvatar}`}
                alt="User avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-primary-custom flex items-center justify-center text-white font-bold ${
                otherUserAvatar ? "hidden" : ""
              }`}
            >
              <span>U</span>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col",
            isOwnMessage ? "items-end" : "items-start"
          )}
        >
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
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
