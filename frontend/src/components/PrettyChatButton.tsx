import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircleMore, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface PrettyChatButtonProps {
  unreadCount?: number;
  isOnline?: boolean;
  className?: string;
}

export default function PrettyChatButton({ 
  unreadCount = 0, 
  isOnline = true,
  className = "" 
}: PrettyChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Show pulse animation when there are new messages
  useEffect(() => {
    if (unreadCount > 0) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <Link href="/chatroom" className={`inline-block ${className}`}>
      <div className="relative group">
        {/* Main Button */}
        <Button
          variant="outline"
          size="sm"
          className={`
            relative overflow-hidden
            border-2 border-[#003366] hover:border-[#004488]
            bg-gradient-to-r from-white via-blue-50 to-indigo-50
            hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50
            rounded-full px-4 py-2 h-10
            shadow-md hover:shadow-lg
            transition-transform duration-200
            transform hover:scale-105 active:scale-95
            will-change-transform
            ${isHovered ? 'ring-2 ring-blue-200/50' : ''}
            ${showPulse ? 'animate-pulse' : ''}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Content */}
          <div className="relative flex items-center gap-2 z-10">
            <div className="relative">
              <MessageCircleMore className={`
                w-4 h-4 text-[#003366] 
                transition-all duration-200 ease-out
                ${isHovered ? 'rotate-12 text-[#004488]' : ''}
              `} />
              {/* Online Status Indicator */}
              {isOnline && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse" />
              )}
            </div>
            {/* Text (appears on hover) */}
            <span className={`
              text-[#003366] font-medium text-sm
              transition-all duration-200 ease-out
              ${isHovered ? 'opacity-100 translate-x-0 max-w-xs' : 'opacity-0 -translate-x-2 max-w-0'}
              overflow-hidden whitespace-nowrap
            `}>
              Чат
            </span>
            {/* Sparkle Effect */}
            {isHovered && (
              <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" />
            )}
          </div>
        </Button>
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <Badge className={`
            absolute -top-2 -right-2 h-5 min-w-5 px-1
            bg-gradient-to-r from-red-500 to-pink-500
            hover:from-red-600 hover:to-pink-600
            text-white text-xs font-bold
            rounded-full border-2 border-white
            shadow-lg
            animate-bounce
            transition-all duration-200 ease-out
            ${isHovered ? 'scale-110' : ''}
          `}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
    </Link>
  );
} 