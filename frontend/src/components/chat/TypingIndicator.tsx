import React from "react";

interface TypingIndicatorProps {
  typingUsers: { [key: string]: string };
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (Object.keys(typingUsers).length === 0) return null;

  const typingUsersList = Object.values(typingUsers);
  const isMultiple = typingUsersList.length > 1;

  return (
    <div className="flex items-center p-4 bg-gray-50 border-t border-gray-100">
      <div className="flex items-center bg-gray-50 rounded-2xl px-5 py-3 shadow-lg border border-gray-200 max-w-xs">
        {/* Typing animation dots */}
        <div className="flex items-center space-x-1 mr-3">
          <div
            className="w-2 h-2 bg-primary-custom rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-custom rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-custom rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Typing text */}
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">
            {typingUsersList.length === 1 ? (
              <span className="text-primary-custom font-semibold">
                {typingUsersList[0]}
              </span>
            ) : (
              <span className="text-primary-custom font-semibold">
                {typingUsersList.slice(0, -1).join(", ")} болон{" "}
                {typingUsersList[typingUsersList.length - 1]}
              </span>
            )}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            {isMultiple ? " бичиж байна" : " бичиж байна"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
