"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MessageCircle,
  Phone,
  Shield,
  DollarSign,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Video,
  User,
  Building,
  AlertCircle,
} from "lucide-react";
import {
  useGetAppointmentsByLawyerQuery,
  useGetAppointmentsByUserQuery,
} from "@/generated";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import LawyerInfo from "@/components/appointments/LawyerInfo";

// Status colors mapping
const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  IN_PROGRESS: "bg-[#003366]/10 text-[#003366] border-[#003366]/20",
};

// Status labels in Mongolian
const statusLabels = {
  PENDING: "Хүлээгдэж буй",
  CONFIRMED: "Баталгаажсан",
  CANCELLED: "Цуцлагдсан",
  COMPLETED: "Дууссан",
  IN_PROGRESS: "Явуулж байна",
};

interface AppointmentWithDetails {
  id: string;
  clientId: string;
  lawyerId: string;
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
  chatRoomId: string;
  price?: number;
  subscription?: string;
  specialization?: {
    _id: string;
    lawyerId: string;
    specializationId: string;
    categoryName: string;
    subscription: string;
    pricePerHour: number;
  };
  lawyer?: {
    _id: string;
    lawyerId: string;
    clerkUserId: string;
    firstName: string;
    lastName: string;
    email: string;
    licenseNumber: string;
    bio: string;
    university: string;
    profilePicture: string;
    rating: number;
    status: string;
  };
}

const AppointmentsPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [expandedAppointments, setExpandedAppointments] = useState<Set<string>>(
    new Set()
  );

  // Determine user role
  const userRole = (user?.publicMetadata?.role as string) || "client"; // Default to client if role not set
  const userId = user?.id;

  // Fetch appointments based on user role
  const {
    data: lawyerAppointmentsData,
    loading: lawyerLoading,
    error: lawyerError,
    refetch: refetchLawyer,
  } = useGetAppointmentsByLawyerQuery({
    variables: { lawyerId: userId || "" },
    skip: !userId || userRole !== "lawyer",
    fetchPolicy: "cache-and-network",
  });

  const {
    data: clientAppointmentsData,
    loading: clientLoading,
    error: clientError,
    refetch: refetchClient,
  } = useGetAppointmentsByUserQuery({
    variables: { clientId: userId || "" },
    skip: !userId || userRole !== "client",
    fetchPolicy: "cache-and-network",
  });

  // Use the appropriate data based on role
  const appointmentsData =
    userRole === "lawyer" ? lawyerAppointmentsData : clientAppointmentsData;
  const loading = userRole === "lawyer" ? lawyerLoading : clientLoading;
  const error = userRole === "lawyer" ? lawyerError : clientError;
  const refetch = userRole === "lawyer" ? refetchLawyer : refetchClient;

  // Process appointments with basic details (lawyer details will be fetched individually)
  const appointmentsWithDetails: AppointmentWithDetails[] = useMemo(() => {
    const appointments =
      userRole === "lawyer"
        ? (appointmentsData as any)?.getAppointmentsByLawyer
        : (appointmentsData as any)?.getAppointmentsByUser;

    if (!appointments) return [];

    return appointments
      .filter((appointment: any) => appointment && appointment.id) // Filter out null/undefined appointments
      .map((appointment: any) => ({
        ...appointment,
        lawyer: null, // Will be populated when needed
      }));
  }, [appointmentsData, userRole]);

  // Filter appointments by status
  const filteredAppointments = useMemo(() => {
    if (selectedStatus === "ALL") return appointmentsWithDetails;
    return appointmentsWithDetails.filter(
      (apt) => apt.status === selectedStatus
    );
  }, [appointmentsWithDetails, selectedStatus]);

  // Toggle appointment expansion
  const toggleExpansion = (appointmentId: string) => {
    setExpandedAppointments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, "HH:mm");
    } catch {
      return timeString;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy", { locale: enUS });
    } catch {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusKey = status as keyof typeof statusColors;
    return (
      <Badge
        className={`${statusColors[statusKey] || statusColors.PENDING} border`}
        variant="outline"
      >
        {statusLabels[statusKey] || status}
      </Badge>
    );
  };

  // Handle chat navigation
  const handleChatClick = (chatRoomId: string) => {
    if (chatRoomId) {
      router.push(`/chatroom?roomId=${chatRoomId}`);
    }
  };

  // Handle video meeting
  const handleVideoMeeting = () => {
    // TODO: Implement video meeting functionality
    // This could integrate with video calling service like Twilio, Zoom, etc.
    alert("Video meeting functionality coming soon!");
  };

  // Handle phone call
  const handlePhoneCall = () => {
    // TODO: Implement phone call functionality
    // This could integrate with calling service
    alert("Phone call functionality coming soon!");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
              <p className="text-gray-600">
                Хэрэглэгчийн мэдээлэл ачаалж байна...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no user role is detected
  if (!user?.publicMetadata?.role) {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-yellow-800 mb-3">
                Хэрэглэгчийн эрх тодорхойлогдоогүй
              </h2>
              <p className="text-yellow-600 mb-4">
                Таны хэрэглэгчийн эрх (lawyer эсвэл client) тодорхойлогдоогүй
                байна. Админтай холбогдож эрхээ тохируулаарай.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Debug: User role not set in publicMetadata
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
              <p className="text-gray-600">
                Уулзалтын мэдээлэл ачааллаж байна...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-800 mb-3">
                Алдаа гарлаа
              </h2>
              <p className="text-red-600 mb-4">
                Уулзалтын мэдээлэл ачаалахад алдаа гарлаа. Дахин оролдоно уу.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Debug: {error.message}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
              >
                Дахин оролдох
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003366] rounded-full mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#003366] mb-3">
            {userRole === "lawyer"
              ? "Миний үйлчлүүлэгчдийн уулзалтууд"
              : "Миний уулзалтууд"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {userRole === "lawyer"
              ? "Үйлчлүүлэгчдийн уулзалтын мэдээлэл"
              : "Өмгөөлөгчдийн уулзалтын мэдээлэл"}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#003366] mb-2">
                  Статусаар шүүх
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-[#003366] rounded-xl bg-white hover:border-[#003366]/50 transition-all duration-200 shadow-sm hover:bg-gray-50 focus:bg-white">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-[#003366]" />
                      <SelectValue placeholder="Статусаар шүүх" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-gray-200 shadow-lg bg-white">
                    <SelectItem
                      value="ALL"
                      className="hover:bg-[#003366]/10 focus:bg-[#003366]/10 rounded-lg mx-1 my-1 bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        Бүх статус
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="PENDING"
                      className="hover:bg-[#003366]/10 focus:bg-[#003366]/10 rounded-lg mx-1 my-1 bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Хүлээгдэж буй
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="CONFIRMED"
                      className="hover:bg-[#003366]/10 focus:bg-[#003366]/10 rounded-lg mx-1 my-1 bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Баталгаажсан
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="IN_PROGRESS"
                      className="hover:bg-[#003366]/10 focus:bg-[#003366]/10 rounded-lg mx-1 my-1 bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#003366] rounded-full mr-2"></div>
                        Явуулж байна
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="COMPLETED"
                      className="hover:bg-[#003366]/10 focus:bg-[#003366]/10 rounded-lg mx-1 my-1 bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                        Дууссан
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="CANCELLED"
                      className="hover:bg-[#003366]/10 focus:bg-[#003366]/10 rounded-lg mx-1 my-1 bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Цуцлагдсан
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => refetch()}
                className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Шинэчлэх
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#003366] mb-3">
                Уулзалт олдсонгүй
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                {selectedStatus === "ALL"
                  ? "Одоогоор уулзалт байхгүй байна."
                  : `${
                      statusLabels[selectedStatus as keyof typeof statusLabels]
                    } статустай уулзалт олдсонгүй.`}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#003366]/20 overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* User Info - Show lawyer info for clients, client info for lawyers */}
                      {userRole === "client" ? (
                        <LawyerInfo lawyerId={appointment.lawyerId} />
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-500 text-white">
                              C
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Үйлчлүүлэгч
                            </h3>
                            <p className="text-sm text-gray-600">
                              ID: {appointment.clientId}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Appointment Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(appointment.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(appointment.slot?.day || "")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(appointment.slot?.startTime || "")} -{" "}
                              {formatTime(appointment.slot?.endTime || "")}
                            </span>
                          </div>
                          {appointment.specialization && (
                            <div className="flex items-center space-x-1">
                              <Shield className="h-4 w-4" />
                              <span>
                                {appointment.specialization.categoryName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpansion(appointment.id)}
                        className="border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200"
                      >
                        {expandedAppointments.has(appointment.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild></DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {expandedAppointments.has(appointment.id) && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* User Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          {userRole === "client"
                            ? "Өмгөөлөгчийн мэдээлэл"
                            : "Үйлчлүүлэгчийн мэдээлэл"}
                        </h4>
                        {userRole === "client" ? (
                          <LawyerInfo
                            lawyerId={appointment.lawyerId}
                            showDetails={true}
                          />
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Уулзалтын ID:</strong> {appointment.id}
                              </p>
                              <div>
                                <strong>Статус:</strong>{" "}
                                {getStatusBadge(appointment.status)}
                              </div>
                              <p>
                                <strong>Огноо:</strong>{" "}
                                {formatDate(appointment.slot?.day || "")}
                              </p>
                              <p>
                                <strong>Цаг:</strong>{" "}
                                {formatTime(appointment.slot?.startTime || "")}{" "}
                                - {formatTime(appointment.slot?.endTime || "")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Appointment Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Уулзалтын мэдээлэл
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span>ID: {appointment.id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>Үйлчлүүлэгч: {appointment.clientId}</span>
                          </div>
                          {appointment.price && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span>Үнэ: ${appointment.price}</span>
                            </div>
                          )}
                          {appointment.specialization && (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              <span>
                                Цаг: ${appointment.specialization.pricePerHour}
                                /цаг
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              Үүсгэсэн:{" "}
                              {formatDate(appointment.createdAt || "")}
                            </span>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2">
                              <p className="text-gray-600">
                                <strong>Тэмдэглэл:</strong> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
                      {appointment.chatRoomId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleChatClick(appointment.chatRoomId!)
                          }
                          className="border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Чат
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVideoMeeting}
                        className="border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Видео уулзалт
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePhoneCall}
                        className="border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Дуудлага
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Detailed View Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-50">
            <DialogHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#003366] rounded-full mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#003366]">
                Уулзалтын дэлгэрэнгүй мэдээлэл
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                {selectedAppointment &&
                  (userRole === "client" ? "Өмгөөлөгч" : "Үйлчлүүлэгч") +
                    " - " +
                    formatDate(selectedAppointment.slot?.day || "")}
              </DialogDescription>
            </DialogHeader>

            {selectedAppointment && (
              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-[#003366] mb-6 flex items-center">
                    <div className="w-8 h-8 bg-[#003366]/10 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-[#003366]" />
                    </div>
                    {userRole === "client"
                      ? "Өмгөөлөгчийн мэдээлэл"
                      : "Үйлчлүүлэгчийн мэдээлэл"}
                  </h3>
                  {userRole === "client" ? (
                    <LawyerInfo
                      lawyerId={selectedAppointment.lawyerId}
                      showDetails={true}
                    />
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Уулзалтын ID:</strong> {selectedAppointment.id}
                      </p>
                      <div>
                        <strong>Статус:</strong>{" "}
                        {getStatusBadge(selectedAppointment.status)}
                      </div>
                      <p>
                        <strong>Огноо:</strong>{" "}
                        {formatDate(selectedAppointment.slot?.day || "")}
                      </p>
                      <p>
                        <strong>Цаг:</strong>{" "}
                        {formatTime(selectedAppointment.slot?.startTime || "")}{" "}
                        - {formatTime(selectedAppointment.slot?.endTime || "")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Appointment Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-[#003366] mb-6 flex items-center">
                    <div className="w-8 h-8 bg-[#003366]/10 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-[#003366]" />
                    </div>
                    Уулзалтын мэдээлэл
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Уулзалтын ID:</strong> {selectedAppointment.id}
                      </p>
                      <p>
                        <strong>Үйлчлүүлэгчийн ID:</strong>{" "}
                        {selectedAppointment.clientId}
                      </p>
                      <p>
                        <strong>Өмгөөлөгчийн ID:</strong>{" "}
                        {selectedAppointment.lawyerId}
                      </p>
                      <div>
                        <strong>Статус:</strong>{" "}
                        {getStatusBadge(selectedAppointment.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>Огноо:</strong>{" "}
                        {formatDate(selectedAppointment.slot?.day || "")}
                      </p>
                      <p>
                        <strong>Цаг:</strong>{" "}
                        {formatTime(selectedAppointment.slot?.startTime || "")}{" "}
                        - {formatTime(selectedAppointment.slot?.endTime || "")}
                      </p>
                      <p>
                        <strong>Үнэ:</strong> $
                        {selectedAppointment.price || "N/A"}
                      </p>
                      <p>
                        <strong>Чат ID:</strong>{" "}
                        {selectedAppointment.chatRoomId || "N/A"}
                      </p>
                    </div>
                  </div>
                  {selectedAppointment.specialization && (
                    <div className="mt-4">
                      <p>
                        <strong>Мэргэжил:</strong>{" "}
                        {selectedAppointment.specialization.categoryName}
                      </p>
                      <p>
                        <strong>Цагийн үнэ:</strong> $
                        {selectedAppointment.specialization.pricePerHour}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.notes && (
                    <div className="mt-4">
                      <p>
                        <strong>Тэмдэглэл:</strong>
                      </p>
                      <p className="text-gray-600">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    className="px-6 py-2 border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200"
                  >
                    Хаах
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedAppointment?.chatRoomId) {
                        handleChatClick(selectedAppointment.chatRoomId);
                        setIsDetailOpen(false);
                      } else {
                        alert("No chat room available for this appointment");
                      }
                    }}
                    className="px-6 py-2 bg-[#003366] hover:bg-[#002244] text-white"
                  >
                    Чатлах
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AppointmentsPage;
