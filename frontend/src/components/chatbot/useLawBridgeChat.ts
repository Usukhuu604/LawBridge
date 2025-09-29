import { useState, useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, gql } from "@apollo/client";

const SAVE_CHAT_HISTORY = gql`
  mutation SaveChatHistory($input: ChatHistoryInput!) {
    saveChatHistory(input: $input) {
      _id
      userId
      sessionId
      userMessage
      botResponse
      createdAt
    }
  }
`;
const GET_CHAT_HISTORY_BY_USER = gql`
  query GetChatHistoryByUser($userId: String!) {
    getChatHistoryByUser(userId: $userId) {
      _id
      userId
      sessionId
      userMessage
      botResponse
      createdAt
    }
  }
`;
const CLEAR_CHAT_HISTORY = gql`
  mutation ClearChatHistory($userId: String!) {
    clearChatHistory(userId: $userId)
  }
`;

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  metadata?: Record<string, unknown>;
  isError?: boolean;
};

export default function useLawBridgeChat() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const [stats, setStats] = useState({ messageCount: 0 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(
    null
  ) as React.RefObject<HTMLTextAreaElement>;

  const [saveChatHistory] = useMutation(SAVE_CHAT_HISTORY);
  const [clearChatHistoryMutation] = useMutation(CLEAR_CHAT_HISTORY);
  const { data, loading, error, refetch } = useQuery(GET_CHAT_HISTORY_BY_USER, {
    variables: { userId: user?.id || "" },
    skip: !user?.id,
    fetchPolicy: "cache-first", // Use cache-first to prevent unnecessary refetches
  });

  useEffect(() => {
    if (data?.getChatHistoryByUser) {
      const history = [...data.getChatHistoryByUser].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const loadedMessages: Message[] = [];
      history.forEach(
        (
          item: { userMessage: string; botResponse: string; createdAt: string },
          index: number
        ) => {
          loadedMessages.push({
            id: index * 2,
            text: item.userMessage,
            sender: "user",
            timestamp: new Date(item.createdAt),
          });
          let botText = item.botResponse;
          try {
            const parsed = JSON.parse(botText);
            botText = parsed.answer || JSON.stringify(parsed);
          } catch {}
          loadedMessages.push({
            id: index * 2 + 1,
            text: botText,
            sender: "bot",
            timestamp: new Date(item.createdAt),
          });
        }
      );
      setMessages(loadedMessages);
      setStats({ messageCount: history.length });
      if (loadedMessages.length > 0) setShowWelcome(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) setConnectionError("Чат түүхийг ачаалах боломжгүй");
  }, [error]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;
    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowWelcome(false);
    setConnectionError(null);
    try {
      const token = await getToken();
      const chatOptions = {
        maxTokens: 600,
        temperature: 0.3,
        includeSourceDocs: true,
        maxHistoryLength: 10,
      };
      const requestBody = {
        message: userMessage.text,
        userId: user.id,
        options: chatOptions,
      };
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://lawbridge-server.onrender.com"
        }/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok)
        throw new Error(
          (await response.json().catch(() => ({}))).error ||
            `HTTP алдаа! статус: ${response.status}`
        );
      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        text:
          data.answer ||
          "Таны мессежийг хүлээн авсан боловч хариу үйлдэл үүсгэж чадсангүй.",
        sender: "bot",
        timestamp: new Date(),
        metadata: data.metadata || {},
      };
      setMessages((prev) => [...prev, botMessage]);
      await saveChatHistory({
        variables: {
          input: {
            userId: String(user.id),
            sessionId: String(sessionId),
            userMessage: String(userMessage.text).trim(),
            botResponse: JSON.stringify(botMessage.text),
          },
        },
      });
      setStats((prev) => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        lastMessageTime: new Date().toISOString(),
      }));
    } catch {
      setConnectionError("Холболт амжилтгүй");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Уучлаарай, таны хүсэлтийг боловсруулах явцад алдаа гарлаа. Дахин оролдоно уу.",
          sender: "bot",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (isLoading || isClearing || !user) return;

    console.log("Clearing chat for user:", user.id);
    setIsClearing(true);

    try {
      // Clear local state first for immediate UI feedback
      setMessages([]);
      setShowWelcome(true);
      setStats({ messageCount: 0 });
      setConnectionError(null);

      // Then clear from server
      const result = await clearChatHistoryMutation({
        variables: { userId: user.id },
      });

      console.log("Clear chat result:", result);

      // Refetch to ensure data consistency
      await refetch();

      console.log("Chat cleared successfully");
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      setConnectionError("Чат түүхийг цэвэрлэх амжилтгүй");

      // Even if server clear fails, keep local state cleared
      // The user can continue with a fresh chat
    } finally {
      setIsClearing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    user,
    isLoaded,
    loading,
    connectionError,
    stats,
    messages,
    showWelcome,
    inputMessage,
    setInputMessage,
    isLoading,
    isClearing,
    clearChat,
    sendMessage,
    handleKeyPress,
    inputRef,
  };
}
