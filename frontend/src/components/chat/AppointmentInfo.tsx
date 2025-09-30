"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Calendar, Clock, Star, CheckCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EndAppointmentButton } from "@/components/appointment";
import { gql } from "@apollo/client";

const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      _id
      clientId
      lawyerId
      schedule
      status
      specializationId
      slot {
        day
        startTime
        endTime
        booked
      }
      notes
      createdAt
      updatedAt
      chatRoomId
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
        name
      }
    }
  }
`;

interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  status: string;
  specializationId: string;
  subscription: boolean;
  slot: {
    day: string;
    startTime: string;
    endTime: string;
    booked: boolean;
  };
  notes: string;
  createdAt: string;
  chatRoomId: string;
}

interface AppointmentInfoProps {
  chatRoomId: string;
  currentUserId: string;
  onAppointmentCompleted?: (appointmentId: string) => void;
}

export default function AppointmentInfo({
  chatRoomId,
  currentUserId,
  onAppointmentCompleted,
}: AppointmentInfoProps) {
  const [showAppointmentInfo, setShowAppointmentInfo] = useState(true);

  // Get appointments
  const { data: appointmentData, loading: appointmentLoading } = useQuery(
    GET_APPOINTMENTS,
    {
      skip: !chatRoomId,
    }
  );

  // Find appointment by chatRoomId
  const appointment: Appointment | null =
    appointmentData?.getAppointments?.find(
      (apt: Appointment) => apt.chatRoomId === chatRoomId
    ) || null;

  // Get lawyer info if appointment exists
  const { data: lawyerData } = useQuery(GET_LAWYER_BY_ID, {
    variables: { lawyerId: appointment?.lawyerId },
    skip: !appointment?.lawyerId,
  });

  // Auto-hide appointment info after 10 seconds if completed
  useEffect(() => {
    if (appointment?.status === "COMPLETED") {
      const timer = setTimeout(() => {
        setShowAppointmentInfo(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [appointment?.status]);

  if (!appointment || !showAppointmentInfo || appointmentLoading) {
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

  const lawyerName = lawyerData?.getLawyerById
    ? `${lawyerData.getLawyerById.firstName} ${lawyerData.getLawyerById.lastName}`
    : "Өмгөөлөгч";

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
                appointment={appointment}
                lawyerName={lawyerName}
                lawyerDbId={lawyerData?.getLawyerById?._id || ""}
                onAppointmentCompleted={onAppointmentCompleted}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
