import React, { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { ChatHeader } from "./ChatHeader";
import AppointmentInfo from "./AppointmentInfo";
import { VideoCallModal } from "./VideoCallModal";
import { LiveKitRoom } from "@livekit/components-react";
import useChatRoomState from "@/app/chatroom/hooks/useChatRoomState";
import { EndAppointmentButton } from "@/components/appointment";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { X, Calendar, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEndAppointmentModal, setShowEndAppointmentModal] = useState(false);
  const [modalStep, setModalStep] = useState<"confirmation" | "review">(
    "confirmation"
  );
  const router = useRouter();

  const {
    user,
    messages,
    setMessages,
    typingUsers,
    isSending,
    isLoading,
    error,
    handleSendMessage,
    handleSendFile,
    handleTyping,
    messagesEndRef,
    otherUser,
    handleDeleteAllMessages,
    isDeletingMessages,
    handleJoinCall,
    handleLeaveCall,
    activeCallType,
    liveKitToken,
  } = useChatRoomState(chatRoomId);

  // Get chat room details to get appointmentId
  const { data: chatRoomData } = useQuery(GET_CHATROOM_BY_ID, {
    variables: { id: chatRoomId },
    skip: !chatRoomId,
  });

  const appointmentId = chatRoomData?.getChatRoomById?.appointmentId;

  // Get appointment details
  const { data: appointmentData } = useQuery(GET_APPOINTMENT_BY_ID, {
    variables: { getAppointmentByIdId: appointmentId },
    skip: !appointmentId,
  });

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

  // Get lawyer name for display
  const lawyerName = appointment?.specialization?.categoryName
    ? `${appointment.specialization.categoryName} специалист`
    : otherUser?.name || "Өмгөөлөгч";

  // Check if we should show the end appointment button
  const shouldShowEndAppointmentButton =
    appointment &&
    appointment.clientId === user?.id &&
    appointment.status === "PENDING";

  const handleDeleteConfirm = async () => {
    await handleDeleteAllMessages();
    setShowDeleteDialog(false);
  };

  const handleCallAction = (type: "video" | "audio") => {
    if (activeCallType) {
      handleLeaveCall();
    } else {
      handleJoinCall(type);
    }
  };

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
    }, 2000);
  };

  const handleAppointmentCompleted = (appointmentId: string) => {
    console.log(`Appointment ${appointmentId} completed`);
    // You can add additional logic here if needed
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          Please log in to continue
        </div>
      </div>
    );
  }

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
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-900 relative min-h-0 chat-scroll-container">
          <div className="space-y-4">
            <MessageList
              messages={messages}
              setMessages={setMessages}
              currentUserId={user?.id}
              isLoading={isLoading}
              otherUserAvatar={otherUser?.avatar}
            />
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="flex-shrink-0 bg-red-50 border-t border-red-200 px-4 py-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 z-10">
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
            disabled={isLoading}
            isSending={isSending}
            onTyping={handleTyping}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete All Messages
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete all messages in this chat? This
                action cannot be undone.
                <br />
                <span className="font-semibold text-red-600">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}{" "}
                  will be permanently deleted.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeletingMessages}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeletingMessages}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeletingMessages ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Messages
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      {/* LiveKit Room and Video Call Modal */}
      {activeCallType && liveKitToken && (
        <LiveKitRoom
          token={liveKitToken}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
          connect
        >
          <VideoCallModal
            user={otherUser}
            onEndCall={handleLeaveCall}
            callType={activeCallType}
          />
        </LiveKitRoom>
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

            <div className="p-6">
              {modalStep === "confirmation" ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Цаг захиалга дуусгах уу?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Та {lawyerName}-тэй хийсэн цаг захиалгаа дуусгаж, үнэлгээ
                      өгөх боломжтой.
                    </p>
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
                    >
                      Үргэлжлүүлэх
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Үнэлгээ өгөх
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {lawyerName}-тэй хийсэн үйлчлүүлэлтийн талаар үнэлгээ өгнө
                      үү.
                    </p>
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
