"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Star, CheckCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EndAppointmentButton } from "@/components/appointment";

interface Appointment {
  _id: string;
  clientId: string;
  lawyerId: string;
  schedule: string;
  status: string;
  specializationId: string;
  slot: {
    day: string;
    startTime: string;
    endTime: string;
    booked: boolean;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
  chatRoomId: string;
}

interface AppointmentInfoMockProps {
  chatRoomId: string;
  currentUserId: string;
  onAppointmentCompleted?: (appointmentId: string) => void;
}

// Mock data for demonstration
const mockAppointments: Appointment[] = [
  {
    _id: "68832e176159edbe4fc632d0",
    clientId: "current-user-id", // This will match any current user for testing
    lawyerId: "user_30K0u3vhLpvQSRt7aS0xzNcAiKd",
    schedule: "2025-07-25T07:11:19.924Z",
    status: "PENDING",
    specializationId: "68822b90726f869773c7c19b",
    slot: {
      day: "2025-07-24",
      startTime: "03:00",
      endTime: "03:30",
      booked: true,
    },
    notes: "Хуулийн зөвлөгөө авах",
    createdAt: "2025-07-25T07:11:19.926Z",
    updatedAt: "2025-07-25T07:11:20.113Z",
    chatRoomId: "test-chatroom-123", // Changed to a test ID
  },
  {
    _id: "68832e176159edbe4fc632d1",
    clientId: "user_30MB8qCtnKfeE4eKg4VPZNvReDp",
    lawyerId: "user_30K0u3vhLpvQSRt7aS0xzNcAiKd",
    schedule: "2025-07-20T10:00:00.000Z",
    status: "COMPLETED",
    specializationId: "68822b90726f869773c7c19b",
    slot: {
      day: "2025-07-20",
      startTime: "10:00",
      endTime: "10:30",
      booked: true,
    },
    notes: "Гэр бүлийн хуулийн зөвлөгөө",
    createdAt: "2025-07-20T09:00:00.000Z",
    updatedAt: "2025-07-20T10:30:00.000Z",
    chatRoomId: "68832e186159edbe4fc632d3",
  },
];

const mockLawyers: { [key: string]: { name: string; specialization: string } } =
  {
    user_30K0u3vhLpvQSRt7aS0xzNcAiKd: {
      name: "Батбаяр.Б",
      specialization: "Гэр бүлийн хууль",
    },
  };

export default function AppointmentInfoMock({
  chatRoomId,
  currentUserId,
  onAppointmentCompleted,
}: AppointmentInfoMockProps) {
  const [showAppointmentInfo, setShowAppointmentInfo] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Find appointment by chatRoomId
  useEffect(() => {
    const foundAppointment = mockAppointments.find(
      (apt) => apt.chatRoomId === chatRoomId
    );
    setAppointment(foundAppointment || null);
    console.log("Looking for appointment with chatRoomId:", chatRoomId);
    console.log("Found appointment:", foundAppointment);
  }, [chatRoomId]);

  // Auto-hide appointment info after 10 seconds if completed
  useEffect(() => {
    if (appointment?.status === "COMPLETED") {
      const timer = setTimeout(() => {
        setShowAppointmentInfo(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [appointment?.status]);

  if (!appointment || !showAppointmentInfo) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM format
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Хүлээгдэж буй
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Дууссан
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <X className="h-3 w-3 mr-1" />
            Цуцлагдсан
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const lawyerName = mockLawyers[appointment.lawyerId]?.name || "Өмгөөлөгч";

  return (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#003366]" />
              <span className="font-semibold text-gray-800">Цаг захиалга</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(appointment.status)}
              <button
                onClick={() => setShowAppointmentInfo(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Хаах"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {formatDate(appointment.slot.day)} -{" "}
                {formatTime(appointment.slot.startTime)} -{" "}
                {formatTime(appointment.slot.endTime)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>{lawyerName}</span>
            </div>

            {appointment.notes && (
              <div className="text-sm text-gray-600">
                <strong>Тэмдэглэл:</strong> {appointment.notes}
              </div>
            )}
          </div>

          {/* Show end appointment button only for the client */}
          {appointment.clientId === currentUserId && (
            <div className="pt-3 border-t border-gray-100">
              <EndAppointmentButton
                appointment={{
                  ...appointment,
                  id: appointment._id,
                  subscription: false,
                }}
                lawyerName={lawyerName}
                lawyerDbId="mock-lawyer-id"
                onAppointmentCompleted={onAppointmentCompleted}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
