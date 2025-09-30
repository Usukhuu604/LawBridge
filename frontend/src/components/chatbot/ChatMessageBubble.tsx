import React from "react";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Message {
  id: number;
  text: string | { answer: string };
  sender: "user" | "bot";
  timestamp: Date;
  isError?: boolean;
}

interface ChatMessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  userAvatarUrl?: string;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isOwnMessage,
  userAvatarUrl,
}) => (
  <div
    className={`flex w-full items-start gap-3 ${
      isOwnMessage ? "justify-end" : "justify-start"
    }`}
  >
    {!isOwnMessage && (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
    )}
    <div>
      <div
        className={`prose prose-sm max-w-[80vw] sm:max-w-lg rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 ${
          isOwnMessage
            ? "bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-br-sm border border-white/20 shadow-xl hover:shadow-2xl"
            : "bg-white/95 backdrop-blur-sm text-[#003366] border-2 border-[#003366]/10 rounded-bl-sm hover:shadow-xl"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children, ...props }) => (
              <div {...props} className="mb-2 last:mb-0">
                {children}
              </div>
            ),
            code: ({
              inline,
              className,
              children,
              ...props
            }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
              const match = /language-(\w+)/.exec(className || "");
              let codeString = "";
              if (Array.isArray(children)) {
                codeString = (children as (string | undefined)[])
                  .filter((c): c is string => typeof c === "string")
                  .join("");
              } else if (typeof children === "string") {
                codeString = children;
              } else {
                // Defensive: if children is not string/array, render a warning
                return (
                  <code className={className} {...props}>
                    [Invalid code block]
                  </code>
                );
              }
              codeString = codeString.replace(/\n$/, "");
              return !inline ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match?.[1] || "javascript"}
                  PreTag="div"
                  className="rounded-md"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {codeString}
                </code>
              );
            },
          }}
        >
          {typeof message.text === "string"
            ? message.text
            : typeof message.text === "object" &&
              message.text !== null &&
              "answer" in message.text
            ? String((message.text as { answer: string }).answer)
            : JSON.stringify(message.text)}
        </ReactMarkdown>
      </div>
      <div
        className={`text-xs mt-2 px-1 ${
          isOwnMessage
            ? "text-right text-white/70"
            : "text-left text-[#003366]/60"
        }`}
      >
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
    {isOwnMessage &&
      (userAvatarUrl ? (
        <img
          src={userAvatarUrl}
          alt="User avatar"
          className="w-10 h-10 rounded-2xl object-cover bg-[#003366]/10 border-2 border-[#003366]/20 shadow-lg"
        />
      ) : (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#003366]/20 to-[#004080]/20 border-2 border-[#003366]/30 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-[#003366]" />
        </div>
      ))}
  </div>
);

export default ChatMessageBubble;
