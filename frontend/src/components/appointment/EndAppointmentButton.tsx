"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Star, CheckCircle, X } from "lucide-react";
import ReviewModal from "./ReviewModal";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const CREATE_REVIEW = gql`
  mutation CreateReview(
    $clientId: ID!
    $lawyerId: ID!
    $input: CreateReviewInput!
  ) {
    createReview(clientId: $clientId, lawyerId: $lawyerId, input: $input) {
      id
      clientId
      lawyerId
      rating
      comment
      createdAt
      updatedAt
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

interface EndAppointmentButtonProps {
  appointment: Appointment;
  lawyerName: string;
  lawyerDbId: string;
  onAppointmentCompleted?: (appointmentId: string) => void;
}

export default function EndAppointmentButton({
  appointment,
  lawyerName,
  lawyerDbId,
  onAppointmentCompleted,
}: EndAppointmentButtonProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createReview] = useMutation(CREATE_REVIEW);

  // Check if appointment time has passed
  const isAppointmentTimePassed = useCallback(() => {
    const now = new Date();
    const appointmentDate = new Date(appointment.slot.day);
    const [hours, minutes] = appointment.slot.endTime.split(":").map(Number);

    // Set the end time for the appointment day
    const appointmentEndTime = new Date(appointmentDate);
    appointmentEndTime.setHours(hours, minutes, 0, 0);

    return now > appointmentEndTime;
  }, [appointment.slot.day, appointment.slot.endTime]);

  // Auto-trigger review modal when appointment time passes
  useEffect(() => {
    if (appointment.status === "PENDING" && isAppointmentTimePassed()) {
      setShowReviewModal(true);
    }
  }, [
    appointment.status,
    appointment.slot.day,
    appointment.slot.endTime,
    isAppointmentTimePassed,
  ]);

  const handleEndAppointment = () => {
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    setIsSubmitting(true);

    try {
      // Create review using GraphQL mutation with explicit parameters
      const result = await createReview({
        variables: {
          clientId: appointment.clientId,
          lawyerId: lawyerDbId,
          input: {
            rating,
            comment: comment.trim() || null,
          },
        },
      });

      console.log("Review created successfully:", result.data);

      // Notify parent component
      onAppointmentCompleted?.(appointment.id);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error; // Re-throw to let ReviewModal handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
  };

  // Don't show button if appointment is already completed
  if (appointment.status === "COMPLETED") {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Дууссан</span>
      </div>
    );
  }

  // Don't show button if appointment is cancelled
  if (appointment.status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
        <X className="h-4 w-4" />
        <span className="text-sm font-medium">Цуцлагдсан</span>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleEndAppointment}
        disabled={isSubmitting}
        className="text-white rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
        style={{
          background: isSubmitting
            ? "linear-gradient(to right, #9ca3af, #6b7280)"
            : "linear-gradient(to right, #003366, #004080)",
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background =
              "linear-gradient(to right, #002244, #003366)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background =
              "linear-gradient(to right, #003366, #004080)";
          }
        }}
      >
        {isSubmitting ? (
          <>
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Боловсруулж байна...
          </>
        ) : (
          <>
            <Star className="h-4 w-4 mr-2" />
            Цаг захиалга дуусгах
          </>
        )}
      </Button>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        lawyerName={lawyerName}
        appointmentTime={`${appointment.slot.day} ${appointment.slot.startTime} - ${appointment.slot.endTime}`}
        isLoading={isSubmitting}
      />
    </>
  );
}
