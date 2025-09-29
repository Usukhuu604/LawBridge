"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";
// import { getSocket } from "@/lib/socket";

interface ChatInputProps {
  chatRoomId?: string;
  onFileChange?: (file: File) => void;
  isSending?: boolean;
  sender?: {
    id: string;
    username: string;
    imageUrl: string;
  };
  onSend?: (content: string) => void | Promise<void>;
  onTyping?: (typing: boolean) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  chatRoomId,
  onFileChange,
  isSending,
  sender,
  onSend,
  onTyping,
  disabled,
}) => {
  const [msg, setMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
    if (onTyping) {
      onTyping(true);
    }
  };

  const handleBlur = () => {
    if (onTyping) {
      onTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    if (onSend) {
      await onSend(msg.trim());
    } else if (chatRoomId && sender) {
      // // const socket = getSocket();
      // socket.emit("chat-message", {
      //   chatRoomId,
      //   sender,
      //   type: "TEXT",
      //   content: msg.trim(),
      // });
    }
    setMsg("");
    if (onTyping) {
      onTyping(false);
    }
  };

  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onFileChange) {
      onFileChange(e.target.files[0]);
    }
    e.target.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 md:gap-4 p-4 bg-white border-t border-gray-200 shadow-lg"
    >
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileSelected}
      />
      <button
        type="button"
        onClick={handleFileIconClick}
        title="Attach file"
        className="p-3 rounded-full text-primary-custom hover:bg-primary-custom/10 transition-all duration-200 hover:scale-110"
      >
        <Paperclip size={20} className="text-primary-custom" />
      </button>
      <input
        value={msg}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="flex-1 rounded-full border-2 border-gray-200 bg-gray-50 px-6 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-primary-custom transition-all duration-200 placeholder:text-gray-400"
        placeholder="Type a message..."
        disabled={isSending || disabled}
      />
      <button
        type="submit"
        disabled={!msg.trim() || isSending || disabled}
        className={cn(
          "p-3 rounded-full text-white transition-all duration-200 shadow-md hover:shadow-lg",
          "bg-primary-custom hover:bg-primary-custom hover:scale-110",
          "disabled:opacity-50 disabled:bg-gray-400 disabled:hover:scale-100"
        )}
      >
        <Send size={20} className="text-white" />
      </button>
    </form>
  );
};
