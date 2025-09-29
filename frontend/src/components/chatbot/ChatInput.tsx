import React, { RefObject, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  isLoading,
  onSend,
  onKeyPress,
  inputRef,
}) => {
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputMessage, inputRef]);

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={onKeyPress}
              placeholder="Илгээхийн тулд Enter дарна уу"
              rows={1}
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all duration-200 bg-white placeholder:text-gray-500"
              disabled={isLoading}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
            />
          </div>
          <button
            onClick={onSend}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-xl flex items-center space-x-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 min-w-[100px] justify-center"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? "Илгээж байна..." : "Илгээх"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
