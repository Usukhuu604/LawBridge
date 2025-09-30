import React from "react";
import {
  Scale,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Trash2,
  MoreVertical,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatbotHeaderProps {
  stats: { messageCount: number };
  connectionError: string | null;
  messageCount: number;
  isLoading: boolean;
  onClearChat?: () => void;
  isClearing?: boolean;
}

const ChatHeader: React.FC<ChatbotHeaderProps> = ({
  stats,
  connectionError,
  isLoading,
  onClearChat,
  isClearing = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleClearChat = () => {
    if (onClearChat && !isClearing) {
      onClearChat();
    }
  };

  return (
    <div className="bg-gradient-to-r from-white via-white to-[#003366]/5 backdrop-blur-md shadow-xl border-b border-[#003366]/20 px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/5 via-transparent to-[#004080]/5 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#003366]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#004080]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={handleBack}
            className="p-2.5 hover:bg-[#003366]/15 rounded-2xl transition-all duration-300 group hover:scale-105 active:scale-95 hover:shadow-lg"
            title="Буцах"
          >
            <ArrowLeft className="w-5 h-5 text-[#003366] group-hover:text-[#004080] transition-colors duration-300 group-hover:-translate-x-1" />
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-[#003366]/10 hover:ring-[#003366]/20 transition-all duration-300 hover:scale-105 header-logo header-glow relative overflow-hidden">
            <Scale className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
            <div className="absolute inset-0 header-shimmer"></div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-playfair-display bg-gradient-to-r from-[#003366] to-[#004080] bg-clip-text text-transparent">
              LawBridge AI
            </h1>
            <p className="text-sm sm:text-base text-[#003366]/80 font-medium">
              Хууль зүйн мэргэжлийн туслах
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {connectionError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl border border-red-200 shadow-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">
                Холболтын асуудал
              </span>
              <span className="sm:hidden font-medium">Алдаа</span>
            </div>
          )}

          {stats.messageCount > 0 && !connectionError && (
            <div className="flex items-center space-x-2 text-sm text-[#003366]/80 bg-[#003366]/10 px-3 py-2 rounded-xl border border-[#003366]/20 shadow-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">
                {stats.messageCount} мессеж
              </span>
              <span className="sm:hidden font-medium">
                {stats.messageCount}
              </span>
            </div>
          )}

          {stats.messageCount > 0 && onClearChat && (
            <button
              onClick={handleClearChat}
              disabled={isClearing || isLoading}
              className="p-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              title="Чат цэвэрлэх"
            >
              {isClearing ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
