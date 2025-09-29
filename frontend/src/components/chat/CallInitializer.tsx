import { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";

interface CallInitializerProps {
  callType: "video" | "audio";
  onConnected: () => void;
}

const CallInitializer: React.FC<CallInitializerProps> = ({ callType, onConnected }) => {
  const room = useRoomContext();
  useEffect(() => {
    const enableMedia = async () => {
      if (room.state === "connected") {
        await room.localParticipant.setMicrophoneEnabled(true);
        if (callType === "video") {
          await room.localParticipant.setCameraEnabled(true);
        }
        onConnected();
      }
    };
    enableMedia();
  }, [room, callType, onConnected]);
  return null;
};

export default CallInitializer; 