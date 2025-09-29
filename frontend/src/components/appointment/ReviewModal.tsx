"use client";

import { useState } from "react";
import { Star, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  lawyerName: string;
  appointmentTime: string;
  isLoading?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  lawyerName,
  appointmentTime,
  isLoading = false,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the isLoading prop from parent or internal state
  const isCurrentlySubmitting = isLoading || isSubmitting;

  const handleSubmit = async () => {
    if (rating === 0) {
      return; // Don't submit without rating
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      // Reset form after successful submission
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isCurrentlySubmitting) {
      setRating(0);
      setComment("");
      onClose();
    }
  };

  const formatAppointmentTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        {/* Custom header with gradient */}
        <div className="bg-gradient-to-r from-primary-custom to-primary-custom/80 px-6 py-4 rounded-t-lg -m-6 mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-black">
              Үнэлгээ өгөх
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isCurrentlySubmitting}
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-black/90 mt-2">
            {lawyerName} -тэй хийсэн {formatAppointmentTime(appointmentTime)}-ны
            үйлчлүүлэлтийн талаар үнэлгээ өгнө үү.
          </DialogDescription>
        </div>

        <div className="space-y-6 px-2">
          {/* Rating Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-900">
              Үнэлгээ <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isCurrentlySubmitting}
                  className="focus:outline-none rounded-lg p-2 transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 transition-all duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current drop-shadow-sm"
                        : "text-gray-300"
                    } ${
                      isCurrentlySubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 font-medium">
              {rating === 0 && "Үнэлгээ сонгоно уу"}
              {rating === 1 && "Маш муу"}
              {rating === 2 && "Муу"}
              {rating === 3 && "Дундаж"}
              {rating === 4 && "Сайн"}
              {rating === 5 && "Маш сайн"}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              Сэтгэгдэл (заавал биш)
            </Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Танай үйлчлүүлэлтийн талаар сэтгэгдлээ үлдээнэ үү..."
              className="min-h-[100px] resize-none border-2 border-gray-200 focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 rounded-xl transition-all duration-200 shadow-sm focus:shadow-md bg-gray-50/30 focus:bg-gray-50"
              disabled={isCurrentlySubmitting}
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500 тэмдэгт
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCurrentlySubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              Цуцлах
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isCurrentlySubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              style={{
                background:
                  rating === 0 || isCurrentlySubmitting
                    ? "linear-gradient(to right, #9ca3af, #6b7280)"
                    : "linear-gradient(to right, #003366, #004080)",
              }}
              onMouseEnter={(e) => {
                if (rating > 0 && !isCurrentlySubmitting) {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #002244, #003366)";
                }
              }}
              onMouseLeave={(e) => {
                if (rating > 0 && !isCurrentlySubmitting) {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #003366, #004080)";
                }
              }}
            >
              {isCurrentlySubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Илгээж байна...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Илгээх
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
