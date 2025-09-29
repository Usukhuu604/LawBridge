"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserInfo } from "@/hooks/useUserInfo";

interface ChatListItemProps {
  roomId: string;
  otherId: string;
  selected: boolean;
  hasUnread: boolean;
  lastMessage?: string;
  onSelect: (roomId: string) => void;
}

export default function ChatListItem({
  roomId,
  otherId,
  selected,
  hasUnread,
  lastMessage,
  onSelect,
}: ChatListItemProps) {
  const userInfo = useUserInfo(otherId);

  // Fallback values
  const name = userInfo?.name || "Хэрэглэгч";
  const avatar = userInfo?.avatar || "/default-avatar.svg";
  const initial = userInfo?.initial || "?";
  const isOnlineStatus = userInfo?.isOnline || false;
  const userType = userInfo?.userType || "client";

  return (
    <div
      onClick={() => onSelect(roomId)}
      className={`group relative p-4 flex gap-4 items-start cursor-pointer rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
        selected
          ? "bg-primary-custom/5 border-l-4 border-primary-custom shadow-lg"
          : hasUnread
          ? "bg-primary-custom/3 hover:bg-primary-custom/5"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-14 h-14 shadow-md">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary-custom text-white font-semibold text-lg">
            {initial}
          </AvatarFallback>
        </Avatar>
        {isOnlineStatus && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-custom border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`font-semibold text-gray-800 truncate ${
                hasUnread ? "font-bold text-primary-custom" : ""
              }`}
            >
              {name}
            </span>
            {/* User type indicator */}
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                userType === "lawyer"
                  ? "bg-primary-custom/10 text-primary-custom border border-primary-custom/20"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {userType === "lawyer" ? "Өмгөөлөгч" : "Хэрэглэгч"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {lastMessage && (
              <span className="text-xs text-gray-500">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {hasUnread && (
              <div className="w-5 h-5 bg-[#003366] text-white text-xs rounded-full flex items-center justify-center">
                {hasUnread ? "!" : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
