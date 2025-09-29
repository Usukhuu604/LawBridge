"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/app/chatroom/types/chat";
import { useSocket } from "@/context/SocketContext";

interface MessageListProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentUserId?: string;
  otherUserAvatar?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  setMessages,
  currentUserId,
  otherUserAvatar,
}) => {
  const { user, isLoaded } = useUser();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("chat-message", handleNewMessage);

    return () => {
      socket.off("chat-message", handleNewMessage);
    };
  }, [socket, setMessages]);

  if (!isLoaded) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading messages...
      </div>
    );
  }

  return (
    <>
      {messages
        .filter((msg) => msg && msg.userId)
        .map((msg, index) => {
          const isOwnMessage = msg.userId === (currentUserId || user?.id);
          return (
            <MessageBubble
              key={`${msg.userId}-${msg.type}-${msg.content}-${index}`}
              message={msg}
              isOwnMessage={isOwnMessage}
              otherUserAvatar={otherUserAvatar}
            />
          );
        })}
    </>
  );
};
