"use client";

import { useState } from "react";
import { Calendar, Clock, CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EndAppointmentButton from "./EndAppointmentButton";
import ReviewModal from "./ReviewModal";

interface Appointment {
  id: string;
  _id: string;
  clientId: string;
  lawyerId: string;
  schedule: string;
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
  updatedAt: string;
  chatRoomId: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  lawyerName: string;
  lawyerDbId: string;
  specializationName?: string;
  onAppointmentCompleted?: (appointmentId: string) => void;
}

export default function AppointmentCard({
  appointment,
  lawyerName,
  lawyerDbId,
  specializationName,
  onAppointmentCompleted,
}: AppointmentCardProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  const handleAppointmentCompleted = (appointmentId: string) => {
    onAppointmentCompleted?.(appointmentId);
  };

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                {lawyerName}
              </CardTitle>
              {specializationName && (
                <p className="text-sm text-gray-600 mt-1">
                  {specializationName}
                </p>
              )}
            </div>
            {getStatusBadge(appointment.status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Appointment Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(appointment.slot.day)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(appointment.slot.startTime)} -{" "}
                {formatTime(appointment.slot.endTime)}
              </span>
            </div>

            {appointment.notes && (
              <div className="text-sm text-gray-600">
                <strong>Тэмдэглэл:</strong> {appointment.notes}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t">
            <EndAppointmentButton
              appointment={{
                ...appointment,
                id: appointment._id,
              }}
              lawyerName={lawyerName}
              lawyerDbId={lawyerDbId}
              onAppointmentCompleted={handleAppointmentCompleted}
            />
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={async () => {
          // This will be handled by the EndAppointmentButton
          setShowReviewModal(false);
        }}
        lawyerName={lawyerName}
        appointmentTime={appointment.schedule}
      />
    </>
  );
}
