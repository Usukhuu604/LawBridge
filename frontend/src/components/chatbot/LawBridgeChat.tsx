"use client";
import useLawBridgeChat from "./useLawBridgeChat";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import QuickActions from "./QuickActions";
import { Scale } from "lucide-react";

export default function LawBridgeChat() {
  const {
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
    sendMessage,
    handleKeyPress,
    inputRef,
  } = useLawBridgeChat();

  if (!isLoaded || loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004080] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <p className="text-[#003366] font-medium">
            LawBridge AI ачааллаж байна...
          </p>
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004080] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#003366] mb-2">
            Нэвтрэх шаардлагатай
          </h2>
          <p className="text-[#003366]/70">
            LawBridge AI туслахыг ашиглахын тулд нэвтэрнэ үү.
          </p>
        </div>
      </div>
    );

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
    // Focus the input after setting the message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-white chatbot-container">
      <ChatHeader
        stats={stats}
        connectionError={connectionError}
        messageCount={messages.length}
        isLoading={isLoading}
      />
      <div className="flex-1 flex flex-col min-h-0">
        {showWelcome && messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="flex-1 chatbot-messages">
            <ChatMessageList
              messages={messages}
              userId={user.id}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
      {messages.length === 0 && showWelcome && (
        <QuickActions onAction={handleQuickAction} isLoading={isLoading} />
      )}
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
        inputRef={inputRef}
      />
    </div>
  );
}
