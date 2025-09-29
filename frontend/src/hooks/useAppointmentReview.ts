"use client";

import { useState, useEffect, useCallback } from "react";

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

interface UseAppointmentReviewProps {
  appointment: Appointment;
  onAppointmentCompleted?: (appointmentId: string) => void;
}

export function useAppointmentReview({
  appointment,
  onAppointmentCompleted,
}: UseAppointmentReviewProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isAutoTriggered, setIsAutoTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsAutoTriggered(true);
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
      // Call the API to submit review
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          lawyerId: appointment.lawyerId,
          clientId: appointment.clientId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      // Mark appointment as completed
      const updateResponse = await fetch(
        `/api/appointments/${appointment._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "COMPLETED",
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update appointment status");
      }

      // Notify parent component
      onAppointmentCompleted?.(appointment._id);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error; // Re-throw to let ReviewModal handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setIsAutoTriggered(false);
  };

  return {
    showReviewModal,
    isAutoTriggered,
    isSubmitting,
    handleEndAppointment,
    handleSubmitReview,
    handleCloseModal,
    isAppointmentTimePassed: isAppointmentTimePassed(),
  };
}
