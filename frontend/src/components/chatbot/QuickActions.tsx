import React from "react";
import { FileText, HelpCircle, BookOpen, MessageCircle } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
  isLoading: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, isLoading }) => {
  const quickActions = [
    {
      id: "contract",
      label: "Гэрээ шалгах",
      icon: FileText,
      prompt: "Гэрээний нөхцөл, зүйлүүдийг ойлгоход тусална уу",
    },
    {
      id: "legal-advice",
      label: "Хууль зүйн зөвлөгөө",
      icon: HelpCircle,
      prompt: "Асуудлын талаар ерөнхий хууль зүйн зөвлөгөө хэрэгтэй",
    },
    {
      id: "research",
      label: "Хууль зүйн судалгаа",
      icon: BookOpen,
      prompt: "Хууль зүйн урьдчилсан шийдвэр, хэргийг судлахад тусална уу",
    },
    {
      id: "document",
      label: "Баримт бичиг",
      icon: MessageCircle,
      prompt: "Хууль зүйн баримт бичиг бэлтгэхэд тусална уу",
    },
  ];

  return (
    <div className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-6">
        <h3 className="text-lg font-semibold text-[#003366] mb-6 text-center">
          Хурдан үйлдлүүд
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onAction(action.prompt)}
                disabled={isLoading}
                className="flex flex-col items-center p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#003366]/40 hover:shadow-md transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-[#003366]/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#003366]/20 transition-colors duration-200">
                  <Icon className="w-6 h-6 text-[#003366] group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="text-sm font-medium text-[#003366] text-center leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
