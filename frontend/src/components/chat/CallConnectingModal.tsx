import React from "react";

const CallConnectingModal = ({ callType }: { callType: "video" | "audio" }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 max-w-sm w-full">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin opacity-20"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
            {callType === "video" ? "📹" : "🎤"}
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-lg">
            Starting {callType} call...
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Please wait while we connect you
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default CallConnectingModal; 