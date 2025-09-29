import React from "react";
import { Scale, BarChart3, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatbotHeaderProps {
  stats: { messageCount: number };
  connectionError: string | null;
  messageCount: number;
  isLoading: boolean;
}

const ChatHeader: React.FC<ChatbotHeaderProps> = ({
  stats,
  connectionError,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-[#003366]/10 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-[#003366]/10 rounded-xl transition-colors duration-200 group"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#003366] group-hover:text-[#004080] transition-colors duration-200" />
          </button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-2xl flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003366] font-playfair-display">
              LawBridge
            </h1>
            <p className="text-xs sm:text-sm text-[#003366]/70 font-medium">
              Хууль зүйн AI Туслах
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {connectionError && (
            <div className="flex items-center space-x-1 sm:space-x-2 text-red-500 text-xs sm:text-sm bg-red-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Холболтын асуудал</span>
              <span className="sm:hidden">Алдаа</span>
            </div>
          )}
          {stats.messageCount > 0 && !connectionError && (
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-[#003366]/70 bg-[#003366]/5 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {stats.messageCount} мессеж
              </span>
              <span className="sm:hidden">{stats.messageCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
