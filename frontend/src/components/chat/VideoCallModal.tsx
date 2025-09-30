"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MonitorOff,
  Maximize2,
  Minimize2,
  Signal,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  useLocalParticipant,
  useTracks,
  VideoTrack,
  AudioTrack,
  useRemoteParticipants,
  useConnectionState,
} from "@livekit/components-react";
import { Track, ConnectionState } from "livekit-client";
import { User } from "@/app/chatroom/types/chat";
import { cn } from "@/lib/utils";

interface VideoCallModalProps {
  user: User;
  onEndCall: () => void;
  callType: "video" | "audio";
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  user,
  onEndCall,
  callType,
}) => {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const connectionState = useConnectionState();

  // Debug: log connection state changes
  useEffect(() => {
    console.log("[LiveKit] Connection state:", connectionState);
  }, [connectionState]);

  useEffect(() => {
    console.log("[LiveKit] VideoCallModal mounted");
  }, []);

  useEffect(() => {
    if (remoteParticipants.length > 0) {
      console.log("[LiveKit] Remote participant joined:", remoteParticipants.map(p => p.identity));
    }
  }, [remoteParticipants.length]);

  // Find all tracks in the room
  const tracks = useTracks();
  const remoteVideoTrackRef = tracks.find(
    (t) => t.source === Track.Source.Camera && !t.participant.isLocal
  );
  const remoteScreenShareTrackRef = tracks.find(
    (t) => t.source === Track.Source.ScreenShare && !t.participant.isLocal
  );
  const localCameraTrackRef = tracks.find(
    (t) => t.source === Track.Source.Camera && t.participant.isLocal
  );
  const localScreenShareTrackRef = tracks.find(
    (t) => t.source === Track.Source.ScreenShare && t.participant.isLocal
  );

  // State management
  const [isMuted, setIsMuted] = useState(!localParticipant.isMicrophoneEnabled);
  const [isVideoOff, setIsVideoOff] = useState(
    !localParticipant.isCameraEnabled || callType === "audio"
  );
  const [isScreenSharing, setIsScreenSharing] = useState(
    !!localScreenShareTrackRef
  );
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Call duration timer
  useEffect(() => {
    if (remoteParticipants.length > 0) {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remoteParticipants.length]);

  // Sync state with LiveKit
  useEffect(() => {
    setIsMuted(!localParticipant.isMicrophoneEnabled);
    setIsVideoOff(!localParticipant.isCameraEnabled);
    setIsScreenSharing(!!localScreenShareTrackRef);
  }, [
    localParticipant.isMicrophoneEnabled,
    localParticipant.isCameraEnabled,
    localScreenShareTrackRef,
  ]);

  // Control functions
  const toggleMute = async () => {
    const newMutedState = !isMuted;
    await localParticipant.setMicrophoneEnabled(!newMutedState);
    setIsMuted(newMutedState);
  };

  const toggleVideo = async () => {
    const newVideoState = !isVideoOff;
    await localParticipant.setCameraEnabled(!newVideoState);
    setIsVideoOff(newVideoState);
  };

  const toggleScreenShare = async () => {
    const newScreenShareState = !isScreenSharing;
    await localParticipant.setScreenShareEnabled(newScreenShareState);
    setIsScreenSharing(newScreenShareState);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (controlsVisible) {
      timer = setTimeout(() => setControlsVisible(false), 4000);
    }
    return () => clearTimeout(timer);
  }, [controlsVisible]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get connection quality indicator
  const getConnectionQuality = () => {
    switch (connectionState) {
      case ConnectionState.Connected:
        return <Signal className="w-4 h-4 text-green-400" />;
      case ConnectionState.Reconnecting:
        return <WifiOff className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case ConnectionState.Disconnected:
        return <WifiOff className="w-4 h-4 text-red-400" />;
      default:
        return <Wifi className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 overflow-hidden"
      onMouseMove={() => setControlsVisible(true)}
      onTouchStart={() => setControlsVisible(true)}
    >
      {/* Self Preview at the Top (like Messenger) */}
      {callType === "video" &&
        !isVideoOff &&
        localCameraTrackRef &&
        !isScreenSharing && (
          <div className="absolute top-4 right-4 z-30">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white shadow-lg bg-black">
              <VideoTrack
                trackRef={localCameraTrackRef}
                className="w-full h-full object-cover transform scale-x-[-1]" // << Mirror effect
              />
            </div>
          </div>
        )}

      {/* Top Status Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm transition-all duration-300",
          controlsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        )}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white/30"
                />
              ) : null}
              <div>
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs text-slate-300">
                  {remoteParticipants.length > 0
                    ? formatDuration(callDuration)
                    : "Connecting..."}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getConnectionQuality()}
            <span className="text-xs text-slate-300">
              {connectionState === ConnectionState.Connected
                ? "Connected"
                : "Connecting"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {isScreenSharing && localScreenShareTrackRef ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <VideoTrack
              trackRef={localScreenShareTrackRef}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-sm rounded-full font-medium">
              Screen Sharing
            </div>
          </div>
        ) : remoteScreenShareTrackRef ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <VideoTrack
              trackRef={remoteScreenShareTrackRef}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium">
              Screen Sharing
            </div>
          </div>
        ) : remoteVideoTrackRef ? (
          <div className="relative w-full h-full">
            <VideoTrack
              trackRef={remoteVideoTrackRef}
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-4 border-slate-600 shadow-2xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : null}
              </div>
              {remoteParticipants.length === 0 && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {remoteParticipants.length > 0 ? user.name : "Calling..."}
              </h2>
              <p className="text-slate-400 text-lg">
                {remoteParticipants.length > 0
                  ? `In call • ${formatDuration(callDuration)}`
                  : "Waiting for user to connect"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Removed old PiP logic; self-preview is now at the top */}

      {/* Enhanced Controls Bar */}
      <div
        className={cn(
          "absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300",
          controlsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-40 translate-y-2"
        )}
      >
        <div className="flex items-center gap-2 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
          <ControlButton
            onClick={toggleMute}
            label={isMuted ? "Unmute" : "Mute"}
            active={isMuted}
            variant={isMuted ? "danger" : "default"}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </ControlButton>

          {callType === "video" && (
            <ControlButton
              onClick={toggleVideo}
              label={isVideoOff ? "Start Video" : "Stop Video"}
              active={isVideoOff}
              variant={isVideoOff ? "danger" : "default"}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </ControlButton>
          )}

          <ControlButton
            onClick={toggleScreenShare}
            label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
            active={isScreenSharing}
            variant={isScreenSharing ? "primary" : "default"}
          >
            {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
          </ControlButton>

          <ControlButton
            onClick={toggleFullscreen}
            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            active={isFullscreen}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </ControlButton>

          <div className="w-px h-8 bg-white/20 mx-1" />

          <ControlButton
            onClick={onEndCall}
            label="End Call"
            variant="danger"
            active={false}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800"
          >
            <PhoneOff size={20} />
          </ControlButton>
        </div>
      </div>

      {/* Settings Panel */}
      {/* Removed Settings Panel as per edit hint */}

      {/* Audio Tracks (invisible) */}
      {useTracks([Track.Source.Microphone])
        .filter((tr) => !tr.participant.isLocal)
        .map((tr) => (
          <AudioTrack key={tr.publication.trackSid} trackRef={tr} />
        ))}
    </div>
  );
};

// Enhanced Control Button Component
const ControlButton: React.FC<{
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
  className?: string;
}> = ({ children, label, active, onClick, variant = "default", className }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return active
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-slate-700 hover:bg-slate-600 text-white";
      case "danger":
        return active
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-slate-700 hover:bg-slate-600 text-white";
      default:
        return active
          ? "bg-slate-600 hover:bg-slate-500 text-white"
          : "bg-slate-700 hover:bg-slate-600 text-white";
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "p-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95",
          "border border-white/10 shadow-lg",
          getVariantClasses(),
          className
        )}
      >
        {children}
      </button>
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm border border-white/10">
        {label}
      </div>
    </div>
  );
};
