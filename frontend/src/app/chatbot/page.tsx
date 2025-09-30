import LawBridgeChat from "@/components/chatbot/LawBridgeChat";
import React from "react";

const ChatBotPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-grow h-full w-full">
        <LawBridgeChat />
      </div>
    </div>
  );
};

export default ChatBotPage;
