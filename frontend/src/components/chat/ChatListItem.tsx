"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useUser } from "@clerk/nextjs";
import { Trash2, MoreVertical, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ChatListItemProps {
  roomId: string;
  otherId: string;
  selected: boolean;
  hasUnread: boolean;
  lastMessage?: string;
  onSelect: (roomId: string) => void;
  onDelete?: (roomId: string) => void;
  isDeleting?: boolean;
}

export default function ChatListItem({
  roomId,
  otherId,
  selected,
  hasUnread,
  lastMessage,
  onSelect,
  onDelete,
  isDeleting = false,
}: ChatListItemProps) {
  const userInfo = useUserInfo(otherId);
  const { user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Fallback values
  const name = userInfo?.name || "Хэрэглэгч";
  const avatar = userInfo?.avatar || "/default-avatar.svg";
  const initial = userInfo?.initial || "?";
  const isOnlineStatus = userInfo?.isOnline || false;
  const userType = userInfo?.userType || "client";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    setShowDeleteConfirm(true);

    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 200);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(roomId);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div
      onClick={() => onSelect(roomId)}
      className={`relative p-4 flex gap-4 items-start cursor-pointer rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
        selected
          ? "bg-primary-custom/5 border-l-4 border-primary-custom shadow-lg"
          : hasUnread
          ? "bg-primary-custom/3 hover:bg-primary-custom/5"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-14 h-14 shadow-md">
          <AvatarImage
            src={
              avatar
                ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${avatar}`
                : avatar
            }
            alt={name}
          />
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
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex flex-col">
              <span
                className={`font-semibold text-gray-800 truncate ${
                  hasUnread ? "font-bold text-primary-custom" : ""
                }`}
              >
                {name}
              </span>
              {/* Show current user's email if this is their chat item */}
              {otherId === user?.id &&
                user?.emailAddresses?.[0]?.emailAddress && (
                  <span className="text-xs text-gray-500 truncate">
                    {user.emailAddresses[0].emailAddress.split("@")[0]}
                  </span>
                )}
            </div>
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

      {/* Options dropdown - positioned on the right side */}
      {onDelete && (
        <div className="flex-shrink-0 ml-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 opacity-60 hover:opacity-100 hover:bg-gray-100 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  border: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical
                  className="h-4 w-4"
                  style={{ color: "#003366" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(e);
                }}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Устгаж байна..." : "Чат устгах"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border-2 border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Чат устгах
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Энэ чатын бүх мессежийг бүрмөсөн устгах уу? Энэ үйлдлийг буцаах
                боломжгүй.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelDelete(e);
                }}
                disabled={isDeleting}
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Цуцлах
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmDelete(e);
                }}
                disabled={isDeleting}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Устгаж байна...
                  </div>
                ) : (
                  "Устгах"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
