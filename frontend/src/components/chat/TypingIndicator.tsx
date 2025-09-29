import React from "react";

interface TypingIndicatorProps {
  typingUsers: { [key: string]: string };
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (Object.keys(typingUsers).length === 0) return null;

  return (
    <div className="flex items-center space-x-2 p-3">
      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 shadow text-slate-700">
        <span className="font-medium mr-2">
          {Object.values(typingUsers).join(", ")}
          {Object.keys(typingUsers).length === 1 ? " is" : " are"} typing
        </span>
        <span className="flex space-x-1">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator; 