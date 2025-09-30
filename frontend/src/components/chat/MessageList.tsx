import React from "react";
import { useUser } from "@clerk/nextjs";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Array<{
    id: string;
    chatRoomId: string;
    userId: string;
    type: "TEXT" | "IMAGE" | "FILE";
    content: string;
    createdAt: string;
  }>;
  setMessages: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: string;
        chatRoomId: string;
        userId: string;
        type: "TEXT" | "IMAGE" | "FILE";
        content: string;
        createdAt: string;
      }>
    >
  >;
  currentUserId?: string;
  isLoading?: boolean;
  otherUserAvatar?: string;
}

const MessageList: React.FC<MessageListProps> = React.memo(
  ({
    messages,
    setMessages,
    currentUserId,
    isLoading = false,
    otherUserAvatar,
  }) => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">Loading user...</div>
        </div>
      );
    }

    if (isLoading && messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">Loading messages...</div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">No messages yet</div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.userId === (currentUserId || user?.id);
          return (
            <MessageBubble
              key={`${msg.id}-${index}`}
              message={msg}
              isOwnMessage={isOwnMessage}
              otherUserAvatar={otherUserAvatar}
            />
          );
        })}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
