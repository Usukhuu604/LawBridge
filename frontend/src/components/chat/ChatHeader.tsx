"use client";

import React from "react";
import { Video, PhoneCall, Shield, PhoneOff, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  avatar: string;
  isLawyer: boolean;
}

interface ChatHeaderProps {
  user: User;
  onVideoCall: () => void;
  onAudioCall: () => void;
  isCallActive: boolean;
  onEndCall: () => void;
  onEndAppointment?: () => void;
  showEndAppointmentButton?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  onVideoCall,
  onAudioCall,
  isCallActive,
  onEndCall,
  onEndAppointment,
  showEndAppointmentButton = false,
}) => {
  return (
    <div className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-4 sm:py-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          <div className="relative flex-shrink-0">
            {user.avatar &&
            user.avatar !== "/default-avatar.svg" &&
            user.avatar !== "/default-avatar.svg" ? (
              <img
                src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${user.avatar}`}
                alt={user.name}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 sm:border-3 border-white shadow-lg"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            ) : null}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary-custom flex items-center justify-center text-white font-bold border-2 sm:border-3 border-white shadow-lg ${
                user.avatar &&
                user.avatar !== "/default-avatar.svg" &&
                user.avatar !== "/default-avatar.svg"
                  ? "hidden"
                  : ""
              }`}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-primary-custom border-2 sm:border-3 border-white rounded-full shadow-md"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 truncate">
                {user.name}
              </h2>
              {user.isLawyer && (
                <div className="hidden xs:flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-primary-custom/10 to-primary-custom/20 text-primary-custom px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold border border-primary-custom/30 sm:border-2 shadow-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Өмгөөлөгч</span>
                  <span className="sm:hidden">Ө</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center area with email */}
        <div className="flex-1 flex justify-center">
          {user.email && (
            <div className="text-sm text-gray-600 font-medium">
              {user.email.split("@")[0]}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* End Appointment Button - Show only when appropriate */}
          {showEndAppointmentButton && onEndAppointment && (
            <Button
              onClick={onEndAppointment}
              variant="outline"
              size="sm"
              className="bg-white border-gray-300 text-primary-custom hover:bg-primary-custom hover:text-white hover:border-primary-custom shadow-md hover:shadow-lg transition-all duration-300 group font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary-custom group-hover:text-white transition-colors duration-300" />
              <span className="group-hover:text-white transition-colors duration-300 hidden xs:inline">
                Цаг захиалга дуусгах
              </span>
              <span className="group-hover:text-white transition-colors duration-300 xs:hidden">
                Дуусгах
              </span>
            </Button>
          )}
          {isCallActive ? (
            <button
              onClick={onEndCall}
              className="p-2 md:p-3 rounded-full bg-primary-custom hover:bg-primary-custom text-gray-900"
              title="End call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={onAudioCall}
                className="p-2.5 sm:p-3 md:p-3.5 rounded-full bg-primary-custom hover:bg-primary-custom text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden group"
                title="Start audio call"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300"></div>
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
              </button>
              <button
                onClick={onVideoCall}
                className="p-2.5 sm:p-3 md:p-3.5 rounded-full bg-primary-custom hover:bg-primary-custom text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden group"
                title="Start video call"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300"></div>
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
