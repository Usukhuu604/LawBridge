import React, { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { VideoCallModal } from "@/components/chat/VideoCallModal";
import { LiveKitRoom } from "@livekit/components-react";
import useChatRoomState from "@/app/chatroom/hooks/useChatRoomState";
import AppointmentInfo from "./AppointmentInfo";
import { EndAppointmentButton } from "@/components/appointment";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { X, Calendar, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const GET_CHATROOM_BY_ID = gql`
  query GetChatRoomById($id: String!) {
    getChatRoomById(_id: $id) {
      _id
      participants
      appointmentId
      allowedMedia
      lastMessage {
        chatRoomId
        ChatRoomsMessages {
          _id
          userId
          type
          content
          createdAt
        }
      }
    }
  }
`;

const GET_APPOINTMENT_BY_ID = gql`
  query GetAppointmentById($getAppointmentByIdId: String!) {
    getAppointmentById(id: $getAppointmentByIdId) {
      id
      clientId
      lawyerId
      status
      chatRoomId
      price
      subscription
      specializationId
      slot {
        day
        startTime
        endTime
        booked
      }
      specialization {
        _id
        lawyerId
        specializationId
        categoryName
        subscription
        pricePerHour
      }
      createdAt
      endedAt
      notes
    }
  }
`;

const GET_LAWYER_BY_ID = gql`
  query GetLawyerById($lawyerId: ID!) {
    getLawyerById(lawyerId: $lawyerId) {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      specialization {
        _id
        categoryName
      }
    }
  }
`;

interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  status: string;
  chatRoomId: string;
  price?: number;
  subscription: boolean;
  specializationId: string;
  slot: {
    day: string;
    startTime: string;
    endTime: string;
    booked: boolean;
  };
  specialization?: {
    _id: string;
    lawyerId: string;
    specializationId: string;
    categoryName?: string;
    subscription: boolean;
    pricePerHour?: number;
  };
  createdAt?: string;
  endedAt?: string;
  notes?: string;
}

interface ChatRoomProps {
  chatRoomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoomId }) => {
  const router = useRouter();
  const chatRoomState = useChatRoomState(chatRoomId);
  const {
    messages,
    setMessages,
    user,
    otherUser,
    typingUsers,
    isSending,
    isConnected,
    handleSendMessage,
    handleSendFile,
    handleTyping,
    messagesEndRef,
    handleJoinCall,
    handleLeaveCall,
    activeCallType,
    liveKitToken,
  } = chatRoomState;
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showEndAppointmentModal, setShowEndAppointmentModal] = useState(false);
  const [modalStep, setModalStep] = useState<"confirmation" | "review">(
    "confirmation"
  );

  // Get chat room details to get appointmentId
  const { data: chatRoomData } = useQuery(GET_CHATROOM_BY_ID, {
    variables: { id: chatRoomId },
    skip: !chatRoomId,
  });

  // Get appointment by ID from chat room
  const { data: appointmentData } = useQuery(GET_APPOINTMENT_BY_ID, {
    variables: {
      getAppointmentByIdId: chatRoomData?.getChatRoomById?.appointmentId || "",
    },
    skip: !chatRoomData?.getChatRoomById?.appointmentId,
  });

  // Get the appointment directly
  const appointment: Appointment | null =
    appointmentData?.getAppointmentById || null;

  // Get lawyer's database ID using their Clerk ID
  const { data: lawyerData } = useQuery(GET_LAWYER_BY_ID, {
    variables: {
      lawyerId: appointment?.lawyerId || "",
    },
    skip: !appointment?.lawyerId,
  });

  // Get the lawyer's database ID
  const lawyerDbId = lawyerData?.getLawyerById?._id;

  // Get lawyer name from appointment or use otherUser
  const lawyerName = appointment?.specialization?.categoryName
    ? `${appointment.specialization.categoryName} специалист`
    : otherUser?.name || "Өмгөөлөгч";

  // Check if we should show the end appointment button
  const shouldShowEndAppointmentButton =
    appointment &&
    appointment.clientId === user?.id &&
    appointment.status === "PENDING";

  const handleEndAppointment = () => {
    setModalStep("confirmation");
    setShowEndAppointmentModal(true);
  };

  const handleConfirmEndAppointment = () => {
    // Seamless transition to review step
    setModalStep("review");
  };

  const handleCancelEndAppointment = () => {
    setShowEndAppointmentModal(false);
    setModalStep("confirmation");
  };

  const handleReviewSubmitted = (appointmentId: string) => {
    console.log(`Appointment ${appointmentId} completed`);
    setShowEndAppointmentModal(false);
    setModalStep("confirmation");
    handleAppointmentCompleted(appointmentId);

    // Navigate to home page after successful review submission
    setTimeout(() => {
      router.push("/");
    }, 2000); // 2 second delay to show completion message
  };

  const handleCallAction = (type: "video" | "audio") => {
    if (activeCallType) {
      handleLeaveCall();
    } else {
      handleJoinCall(type);
    }
  };

  const handleAppointmentCompleted = (appointmentId: string) => {
    console.log(`Appointment ${appointmentId} completed`);
    // You can add additional logic here, like showing a success message
    // or refreshing the appointment data
  };

  React.useEffect(() => {
    console.log("LiveKit Token (effect):", liveKitToken);
  }, [liveKitToken]);

  return (
    <>
      <main className="w-full h-screen flex flex-col bg-white dark:bg-gray-900 overflow-hidden relative">
        <ChatHeader
          user={otherUser}
          onVideoCall={() => handleCallAction("video")}
          onAudioCall={() => handleCallAction("audio")}
          isCallActive={!!activeCallType}
          onEndCall={handleLeaveCall}
          onEndAppointment={handleEndAppointment}
          showEndAppointmentButton={shouldShowEndAppointmentButton || false}
        />
        <AppointmentInfo
          chatRoomId={chatRoomId}
          currentUserId={user?.id || ""}
          onAppointmentCompleted={handleAppointmentCompleted}
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-900 relative min-h-0 chat-scroll-container">
          <div className="space-y-4">
            <MessageList
              messages={messages}
              setMessages={setMessages}
              currentUserId={user?.id}
              otherUserAvatar={otherUser?.avatar}
            />
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 z-10">
          <ChatInput
            onSend={handleSendMessage}
            onFileChange={handleSendFile}
            onTyping={handleTyping}
            isSending={isSending}
            disabled={!isConnected}
          />
        </div>
        {showUserInfo && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-30 transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Хэрэглэгчийн мэдээлэл
                </h3>
                <button className="p-2" onClick={() => setShowUserInfo(false)}>
                  ×
                </button>
              </div>
              <div className="text-center">
                {/* Avatar and user info here */}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <button
                className="w-full justify-start"
                onClick={() => handleCallAction("audio")}
              >
                Дуудлага хийх
              </button>
              <button
                className="w-full justify-start"
                onClick={() => handleCallAction("video")}
              >
                Видео дуудлага
              </button>
            </div>
          </div>
        )}
      </main>
      {activeCallType && liveKitToken && (
        <LiveKitRoom
          token={liveKitToken}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
          connect
        >
          <VideoCallModal
            onEndCall={handleLeaveCall}
            callType={activeCallType}
            user={otherUser}
          />
        </LiveKitRoom>
      )}
      {showUserInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setShowUserInfo(false)}
        />
      )}

      {/* End Appointment Modal - Single modal with two steps */}
      {showEndAppointmentModal && appointment && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/40 via-primary-custom/20 to-accent/30 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-primary-custom to-primary-custom/80 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">
                  {modalStep === "confirmation"
                    ? "Цаг захиалга дуусгах"
                    : "Өмгөөлөгчид үнэлгээ өгөх"}
                </h3>
                <button
                  onClick={
                    modalStep === "confirmation"
                      ? handleCancelEndAppointment
                      : () => setShowEndAppointmentModal(false)
                  }
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {modalStep === "confirmation" ? (
                <div className="space-y-6">
                  {/* Icon and description */}
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-custom/20 to-accent/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-primary-custom" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Цаг захиалга дуусгах уу?
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Та{" "}
                        <span className="font-semibold text-primary-custom">
                          {lawyerName}
                        </span>
                        -тай хийсэн цаг захиалгаа дуусгахдаа итгэлтэй байна уу?
                        Цаг захиалгаа төлөвлөсөн хугацаанаас өмнө дуусгаж болно.
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCancelEndAppointment}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                      Цуцлах
                    </button>
                    <button
                      onClick={handleConfirmEndAppointment}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      style={{
                        background:
                          "linear-gradient(to right, #003366, #004080)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(to right, #002244, #003366)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(to right, #003366, #004080)";
                      }}
                    >
                      Тийм, дуусгах
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Review header */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-primary-custom/20 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Үнэлгээ өгөх
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        <span className="font-semibold text-primary-custom">
                          {lawyerName}
                        </span>
                        -тай хийсэн цаг захиалгаа дуусгаж байна. Таны үнэлгээ
                        маш чухал!
                      </p>
                    </div>
                  </div>

                  {/* Review form */}
                  <div className="bg-gray-50/50 rounded-xl p-4 border flex justify-center border-gray-100">
                    {appointment && lawyerDbId && (
                      <EndAppointmentButton
                        appointment={appointment}
                        lawyerName={lawyerName}
                        lawyerDbId={lawyerDbId}
                        onAppointmentCompleted={handleReviewSubmitted}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
