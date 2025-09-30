import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUser as useClerkUser, useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "@apollo/client";
import { useSocket } from "@/context/SocketContext";
import { fetchLiveKitToken } from "@/lib/livekit";
import { User as ChatUser } from "@/app/chatroom/types/chat";
import {
  useGetChatRoomByIdQuery,
  useGetLawyerByIdQuery,
  useGetMessagesQuery,
  useDeleteAllMessagesMutation,
} from "@/generated";

// Using generated queries from @/generated

export interface MessageType {
  id: string;
  chatRoomId: string;
  userId: string;
  type: "TEXT" | "IMAGE" | "FILE";
  content: string;
  createdAt: string;
  fromSelf?: boolean;
  fileName?: string;
  fileSize?: number;
}

export interface UseChatRoomState {
  user: ChatUser | null;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  typingUsers: Record<string, string>;
  isSending: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  handleSendMessage: (content: string) => Promise<void>;
  handleSendFile: (file: File, fileUrl: string) => Promise<void>;
  handleTyping: (typing: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  otherUser: ChatUser;
  handleJoinCall: (type: "video" | "audio") => Promise<void>;
  handleLeaveCall: () => void;
  activeCallType: "video" | "audio" | null;
  isJoiningCall: boolean;
  isCallConnected: boolean;
  liveKitToken: string | null;
  setIsCallConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsJoiningCall: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteAllMessages: () => Promise<void>;
  isDeletingMessages: boolean;
}

export default function useChatRoomState(chatRoomId: string): UseChatRoomState {
  const { user, isLoaded: userLoaded } = useClerkUser();
  const { getToken } = useAuth();

  // Don't proceed if user is not loaded yet (prevents hydration issues)
  if (!userLoaded) {
    return {
      user: null,
      messages: [],
      setMessages: () => {},
      typingUsers: {},
      isSending: false,
      isConnected: false,
      isLoading: true,
      error: null,
      handleSendMessage: async () => {},
      handleSendFile: async () => {},
      handleTyping: () => {},
      messagesEndRef: {
        current: null,
      } as unknown as React.RefObject<HTMLDivElement>,
      otherUser: { id: "", name: "", avatar: "", isLawyer: false },
      handleJoinCall: async () => {},
      handleLeaveCall: () => {},
      activeCallType: null,
      isJoiningCall: false,
      isCallConnected: false,
      liveKitToken: null,
      setIsCallConnected: () => {},
      setIsJoiningCall: () => {},
      handleDeleteAllMessages: async () => {},
      isDeletingMessages: false,
    };
  }
  const {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    emitTyping,
    sendMessage: socketSendMessage,
    onMessage,
    offMessage,
    onTyping,
    offTyping,
  } = useSocket();

  // Delete all messages mutation
  const [
    deleteAllMessages,
    { loading: isDeletingMessages, error: deleteError },
  ] = useDeleteAllMessagesMutation();

  // State
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [activeCallType, setActiveCallType] = useState<
    "video" | "audio" | null
  >(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages from GraphQL
  const {
    data: chatData,
    loading: chatLoading,
    refetch,
  } = useGetMessagesQuery({
    variables: { chatRoomId: chatRoomId || "" },
    skip: !chatRoomId,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.getMessages?.[0]?.ChatRoomsMessages) {
        const mappedMessages = data.getMessages[0].ChatRoomsMessages.map(
          (msg: any) => ({
            id: msg._id || `${msg.userId}-${msg.createdAt}`,
            chatRoomId: data.getMessages[0].chatRoomId,
            userId: msg.userId,
            type: msg.type as "TEXT" | "IMAGE" | "FILE",
            content: msg.content,
            createdAt: msg.createdAt,
            fromSelf: msg.userId === user?.id,
          })
        );
        setMessages(mappedMessages);
      }
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("❌ GraphQL error:", err);
      setError(err.message);
      setIsLoading(false);
    },
  });

  // Get chat room info
  const { data: chatRoomData } = useGetChatRoomByIdQuery({
    variables: { id: chatRoomId || "" },
    skip: !chatRoomId,
  });

  // Find other participant
  const otherParticipantId = chatRoomData?.getChatRoomById?.participants?.find(
    (id: string) => id !== user?.id
  );

  // Get lawyer info for other participant
  const { data: lawyerData } = useGetLawyerByIdQuery({
    variables: { lawyerId: otherParticipantId || "" },
    skip: !otherParticipantId,
  });

  // Set other user info
  useEffect(() => {
    if (lawyerData?.getLawyerById) {
      setOtherUser({
        id:
          lawyerData.getLawyerById.clerkUserId || lawyerData.getLawyerById._id,
        name: `${lawyerData.getLawyerById.firstName} ${lawyerData.getLawyerById.lastName}`.trim(),
        avatar:
          lawyerData.getLawyerById.profilePicture || "/default-avatar.png",
        isLawyer: true,
      });
    }
  }, [lawyerData]);

  // Join room when component mounts
  useEffect(() => {
    if (socket && isConnected && chatRoomId) {
      joinRoom(chatRoomId);

      return () => {
        // Cleanup handled by the main message listener
      };
    }
  }, [socket, isConnected, chatRoomId, joinRoom]);

  // Real-time message handling
  useEffect(() => {
    if (!socket || !onMessage || !offMessage) return;

    // Listen for new messages from other users
    const handleNewMessage = (message: any) => {
      // Skip our own messages to avoid duplicates with optimistic updates
      // The backend sends back our own messages with fromSelf: true
      if (message.userId === user?.id) {
        return;
      }

      const newMessage: MessageType = {
        id: message.id || `${message.userId}-${message.createdAt}`,
        chatRoomId: chatRoomId,
        userId: message.userId,
        type: message.type as "TEXT" | "IMAGE" | "FILE",
        content: message.content,
        createdAt: message.createdAt,
        fromSelf: message.fromSelf || false,
      };

      setMessages((prev) => {
        // Check for duplicates
        const exists = prev.some((m) => m.id === newMessage.id);
        if (exists) {
          return prev;
        }
        const updated = [...prev, newMessage];
        return updated;
      });
    };

    // Listen for message errors
    const handleMessageError = (error: any) => {
      console.error("❌ Message error:", error);
      setError(error.error || "Message error");
    };

    // Listen for typing events
    const handleTyping = (data: {
      userId: string;
      username: string;
      isTyping: boolean;
    }) => {
      if (data.userId === user?.id) return;

      setTypingUsers((prev) => {
        const updated = { ...prev };
        if (data.isTyping) {
          updated[data.userId] = data.username;
        } else {
          delete updated[data.userId];
        }
        return updated;
      });
    };

    // Set up listeners using the context methods
    onMessage(handleNewMessage);
    onTyping(handleTyping);

    // Set up error listener directly on socket
    socket.on("messageError", handleMessageError);

    return () => {
      offMessage(handleNewMessage);
      offTyping(handleTyping);
      socket.off("messageError", handleMessageError);
      if (chatRoomId) {
        leaveRoom(chatRoomId);
      }
    };
  }, [
    socket,
    chatRoomId,
    user?.id,
    leaveRoom,
    onMessage,
    offMessage,
    onTyping,
    offTyping,
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      setTimeout(() => {
        const scrollContainer =
          messagesEndRef.current?.closest(".overflow-y-auto");
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [messages.length]); // Removed messages dependency to prevent excessive re-renders

  // Send message handler - Real-time approach
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!user || !chatRoomId || isSending || !content.trim()) {
        return;
      }

      setIsSending(true);

      // Create message object
      const message = {
        userId: user.id,
        content: content.trim(),
        type: "TEXT" as const,
        createdAt: new Date().toISOString(),
      };

      // Add to UI immediately for instant feedback
      const immediateMessage: MessageType = {
        id: `immediate-${Date.now()}`,
        chatRoomId,
        userId: user.id,
        type: "TEXT",
        content: content.trim(),
        createdAt: new Date().toISOString(),
        fromSelf: true,
      };

      setMessages((prev) => {
        const updated = [...prev, immediateMessage];
        return updated;
      });

      // Send via socket for real-time delivery to other users
      if (socketSendMessage) {
        socketSendMessage({
          chatRoomId,
          content: content.trim(),
          userId: user.id,
          type: "TEXT",
        });
      }

      // Since we skip our own messages from socket, we keep the immediate message
      // No need to remove it as it becomes the permanent message

      setError(null);
      setIsSending(false);
    },
    [user, chatRoomId, isSending, socketSendMessage]
  );

  // File handler
  const handleSendFile = useCallback(
    async (file: File, fileUrl: string) => {
      if (!user || !chatRoomId || isSending) {
        return;
      }

      setIsSending(true);

      try {
        // Determine message type based on file type
        let messageType: "IMAGE" | "FILE" = "FILE";
        if (file.type.startsWith("image/")) {
          messageType = "IMAGE";
        }

        // Create message object
        const message = {
          userId: user.id,
          content: fileUrl, // Store the R2 URL
          type: messageType,
          createdAt: new Date().toISOString(),
        };

        // Add to UI immediately for instant feedback
        const immediateMessage: MessageType = {
          id: `immediate-${Date.now()}`,
          chatRoomId,
          userId: user.id,
          type: messageType,
          content: fileUrl,
          createdAt: new Date().toISOString(),
          fromSelf: true,
          fileName: file.name,
          fileSize: file.size,
        };

        setMessages((prev) => {
          const updated = [...prev, immediateMessage];
          return updated;
        });

        // Send via socket for real-time delivery to other users
        if (socketSendMessage) {
          socketSendMessage({
            chatRoomId,
            content: fileUrl,
            userId: user.id,
            type: messageType,
          });
        }

        setError(null);
      } catch (error) {
        console.error("Failed to send file:", error);
        setError(
          error instanceof Error ? error.message : "Failed to send file"
        );
      } finally {
        setIsSending(false);
      }
    },
    [user, chatRoomId, isSending, socketSendMessage]
  );

  // Typing handler
  const handleTyping = useCallback(
    (typing: boolean) => {
      if (!user || !chatRoomId) return;
      emitTyping({ chatRoomId, isTyping: typing });
    },
    [user, chatRoomId, emitTyping]
  );

  // Call handlers (placeholder)
  const handleJoinCall = useCallback(
    async (type: "video" | "audio") => {
      if (!user || !chatRoomId || isJoiningCall) return;
      setIsJoiningCall(true);
      try {
        const clerkToken = await getToken();
        if (!chatRoomId || !clerkToken)
          throw new Error("Missing chatRoomId or Clerk token");
        const token = await fetchLiveKitToken(chatRoomId, clerkToken);
        setActiveCallType(type);
        setLiveKitToken(token);
      } catch (error) {
        setIsJoiningCall(false);
        setError(error instanceof Error ? error.message : String(error));
      }
    },
    [user, chatRoomId, getToken, isJoiningCall]
  );

  const handleLeaveCall = useCallback(() => {
    setLiveKitToken(null);
    setActiveCallType(null);
    setIsCallConnected(false);
    setIsJoiningCall(false);
  }, []);

  // Delete all messages handler
  const handleDeleteAllMessages = useCallback(async () => {
    if (!chatRoomId) {
      console.error("❌ No chat room ID provided");
      return;
    }

    try {
      await deleteAllMessages({
        variables: { chatRoomId },
      });

      // Clear local messages state
      setMessages([]);
    } catch (error) {
      console.error("❌ Failed to delete all messages:", error);
      setError("Failed to delete messages. Please try again.");
    }
  }, [chatRoomId, deleteAllMessages]);

  return {
    user: user
      ? {
          id: user.id,
          name: user.fullName || user.firstName || "User",
          avatar: user.imageUrl || "/default-avatar.png",
          isLawyer: false,
        }
      : null,
    messages,
    setMessages,
    typingUsers,
    isSending,
    isConnected,
    isLoading,
    error: error || (deleteError ? deleteError.message : null),
    handleSendMessage,
    handleSendFile,
    handleTyping,
    messagesEndRef: messagesEndRef as React.RefObject<HTMLDivElement>,
    otherUser: otherUser || { id: "", name: "", avatar: "", isLawyer: false },
    handleJoinCall,
    handleLeaveCall,
    activeCallType,
    isJoiningCall,
    isCallConnected,
    liveKitToken,
    setIsCallConnected,
    setIsJoiningCall,
    handleDeleteAllMessages,
    isDeletingMessages,
  };
}
