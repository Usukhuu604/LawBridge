"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, MoreVertical } from "lucide-react";

interface ChatroomHeaderProps {
  onBack?: () => void;
  onSettings?: () => void;
  onMore?: () => void;
  title?: string;
  subtitle?: string;
}

export default function ChatroomHeader({
  onBack,
  onSettings,
  onMore,
  title = "Чат",
  subtitle,
}: ChatroomHeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="p-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        {onMore && (
          <Button variant="ghost" size="sm" onClick={onMore} className="p-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
