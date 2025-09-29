"use client";
import { MessageCircleMore, Sparkles, Bot, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface FloatingChatbotButtonProps {
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  hasNotification?: boolean;
  className?: string;
}

export default function FloatingChatbotButton({
  href,
  onClick,
  isActive = false,
  hasNotification = false,
  className = "",
}: FloatingChatbotButtonProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  // Periodic pulse animation - less frequent to reduce lag
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 800);
    }, 8000); // Increased from 5s to 8s

    return () => clearInterval(interval);
  }, []);

  // Regenerate particles on hover - debounced
  useEffect(() => {
    if (isHovered) {
      const timeout = setTimeout(() => {
        setParticleKey((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Button clicked, href:", href);
      if (onClick) onClick();
      if (href) {
        console.log("Navigating to:", href);
        router.push(href);
      }
    },
    [href, onClick, router]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`fixed right-4 bottom-4 sm:right-8 sm:bottom-8 md:right-12 md:bottom-12 lg:right-20 lg:bottom-20 z-[9999] ${className}`}
    >
      {/* Floating particles background - only on hover */}
      {isHovered && (
        <div key={particleKey} className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 300}ms`,
                animationDuration: `${1500 + Math.random() * 500}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main button container */}
      <div className="relative group">
        {/* Glow ring effect - simplified */}
        <div
          className={`
          absolute inset-0 rounded-full
          bg-gradient-to-br from-blue-400 to-purple-500
          opacity-0 group-hover:opacity-25 transition-opacity duration-300 ease-out
          scale-110 blur-sm
          ${showPulse ? "animate-pulse opacity-30" : ""}
        `}
        />

        {/* Outer ring - simplified */}
        <div
          className={`
          absolute inset-0 rounded-full
          border-2 border-blue-300/50
          scale-100 group-hover:scale-110
          transition-all duration-300 ease-out
          group-hover:border-blue-400/70 group-hover:shadow-lg group-hover:shadow-blue-400/25
        `}
        />

        {/* Button */}
        <button
          type="button"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`
            relative overflow-hidden z-10
            size-14 sm:size-16 rounded-full
            bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700
            hover:from-blue-500 hover:via-purple-600 hover:to-indigo-700
            active:from-blue-800 active:via-purple-800 active:to-indigo-800
            flex justify-center items-center
            shadow-2xl hover:shadow-3xl
            border-2 border-white/20 hover:border-white/40
            transition-all duration-300 ease-out
            transform hover:scale-110 active:scale-95
            ${isActive ? "ring-4 ring-blue-300/50" : ""}
            ${showPulse ? "animate-bounce" : ""}
            group
          `}
          aria-label="Open AI Chatbot"
        >
          {/* Background shimmer - simplified */}
          <div
            className={`
            absolute inset-0 
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            -translate-x-full group-hover:translate-x-full
            transition-transform duration-800 ease-out
            skew-x-12
          `}
          />

          {/* Icon container */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Main icon */}
            <MessageCircleMore
              className={`
              size-[50%] text-white
              transition-all duration-300 ease-out
              ${isHovered ? "scale-110 rotate-12" : ""}
              ${isActive ? "scale-125" : ""}
              drop-shadow-lg
            `}
            />

            {/* AI Indicator */}
            <div
              className={`
              absolute -top-1 -right-1
              size-3 bg-gradient-to-br from-green-400 to-emerald-500
              rounded-full border border-white/50
              flex items-center justify-center
              transition-all duration-300 ease-out
              ${isHovered ? "scale-125" : ""}
            `}
            >
              <Bot className="size-1.5 text-white" />
            </div>

            {/* Sparkle effect - only on hover */}
            {isHovered && (
              <>
                <Sparkles className="absolute -top-2 -left-2 size-3 text-yellow-300 animate-spin" />
                <Zap className="absolute -bottom-1 -right-2 size-2 text-yellow-400 animate-pulse" />
              </>
            )}
          </div>

          {/* Inner glow */}
          <div
            className={`
            absolute inset-2 rounded-full
            bg-gradient-to-br from-white/10 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300 ease-out
          `}
          />
        </button>

        {/* Notification badge */}
        {hasNotification && (
          <div
            className={`
            absolute -top-1 -right-1 z-20
            size-5 bg-gradient-to-br from-red-500 to-pink-600
            rounded-full border-2 border-white
            flex items-center justify-center
            shadow-lg animate-bounce
            transition-all duration-300 ease-out
            ${isHovered ? "scale-110" : ""}
          `}
          >
            <div className="size-2 bg-white rounded-full animate-pulse" />
          </div>
        )}

        {/* Tooltip */}
        <div
          className={`
          absolute right-full mr-4 top-1/2 -translate-y-1/2
          px-3 py-2 bg-gray-900 text-white text-sm font-medium
          rounded-lg shadow-xl border border-gray-700
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          translate-x-2 group-hover:translate-x-0
          transition-all duration-300 ease-out
          pointer-events-none
          ${isHovered ? "visible" : "invisible"}
        `}
        >
          <div className="flex items-center gap-2">
            <Bot className="size-3" />
            <span>AI Туслах</span>
            <Sparkles className="size-3 text-yellow-400" />
          </div>

          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </div>

        {/* Ripple effect */}
        <div
          className={`
          absolute inset-0 rounded-full
          bg-gradient-to-br from-blue-400/50 to-purple-500/50
          scale-0 group-active:scale-150
          opacity-100 group-active:opacity-0
          transition-all duration-500 ease-out
          pointer-events-none
        `}
        />

        {/* Breathing animation ring - only on hover */}
        <div
          className={`
          absolute inset-0 rounded-full
          border border-blue-400/30
          scale-100 animate-ping
          opacity-0 group-hover:opacity-100
          animation-duration-2000
        `}
        />
      </div>

      {/* Status text (appears on hover) */}
      <div
        className={`
        absolute bottom-full mb-4 left-1/2 -translate-x-1/2
        px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600
        text-white text-xs font-semibold rounded-full
        shadow-lg border border-white/20
        opacity-0 group-hover:opacity-100
        translate-y-2 group-hover:translate-y-0
        transition-all duration-300 ease-out delay-100
        pointer-events-none whitespace-nowrap
        ${isHovered ? "visible" : "invisible"}
      `}
      >
        <div className="flex items-center gap-2">
          <div className="size-2 bg-green-400 rounded-full animate-pulse" />
          <span>AI Онлайн</span>
        </div>
      </div>
    </div>
  );
}

// Usage example component
export function ChatbotButtonExample() {
  return <FloatingChatbotButton href="/chatbot" hasNotification />;
}
