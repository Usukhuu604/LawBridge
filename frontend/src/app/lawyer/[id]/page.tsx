"use client";

import { useState } from "react";
import {
  Mail,
  Star,
  CheckCircle,
  XCircle,
  User,
  ChevronDown,
} from "lucide-react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { use } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const GET_LAWYER_BY_LAWYERID_QUERY = gql`
  query GetLawyerById($lawyerId: ID!) {
    getLawyerById(lawyerId: $lawyerId) {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      achievements {
        _id
        title
        description
        threshold
        icon
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

const GET_AVAILABILITY = gql`
  query GetAvailability($lawyerId: String!) {
    getAvailability(lawyerId: $lawyerId) {
      availableDays {
        day
        startTime
        endTime
        booked
      }
    }
  }
`;

const GET_SPECIALIZATIONS_BY_LAWYER = gql`
  query GetSpecializationsByLawyer($lawyerId: ID!) {
    getSpecializationsByLawyer(lawyerId: $lawyerId) {
      _id
      lawyerId
      specializationId
      categoryName
      subscription
      pricePerHour
    }
  }
`;

const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      clientId
      lawyerId
      status
      chatRoomId
      subscription
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
      notes
      specializationId
    }
  }
`;

type Props = {
  params: Promise<{ id: string }>;
};

interface AppointmentSlot {
  day: string;
  startTime: string;
  endTime: string;
  booked: boolean;
}

const LawyerProfile = ({ params }: Props) => {
  const { id } = use(params);

  // All hooks at the top
  const {
    data: lawyerData,
    loading: lawyerLoading,
    error: lawyerError,
  } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, { variables: { lawyerId: id } });

  const { data: availabilityData, loading: availabilityLoading } = useQuery<{
    getAvailability: Array<{
      availableDays: AppointmentSlot[];
    }>;
  }>(GET_AVAILABILITY, {
    variables: { lawyerId: id },
    skip: false,
  });

  const { data: specializationsData, loading: specializationsLoading } =
    useQuery<{
      getSpecializationsByLawyer: Array<{
        _id: string;
        lawyerId: string;
        specializationId: string;
        categoryName?: string;
        subscription: boolean;
        pricePerHour?: number;
      }>;
    }>(GET_SPECIALIZATIONS_BY_LAWYER, { variables: { lawyerId: id } });

  const { user: currentUser, isSignedIn } = useUser();

  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(
    null
  );
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSpecializationId, setSelectedSpecializationId] =
    useState<string>("");
  const [showReviews, setShowReviews] = useState(false);
  const [showBookingSection, setShowBookingSection] = useState(false);

  const [createAppointment, { loading: creatingAppointment }] = useMutation(
    CREATE_APPOINTMENT,
    {
      onCompleted: () => {
        setAppointmentStatus({
          type: "success",
          message: "Цаг захиалга амжилттай үүслээ!",
        });
        setSelectedSlot(null);
        setAppointmentNotes("");
        setShowBookingModal(false);
      },
      refetchQueries: ["GetAvailability"], // Refetch availability data after appointment creation
      onError: (error) => {
        setAppointmentStatus({
          type: "error",
          message:
            error.message ||
            "Цаг захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.",
        });
      },
    }
  );

  if (lawyerLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#003366]"></div>
      </div>
    );
  }

  if (lawyerError || !lawyerData?.getLawyerById) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 shadow-none sm:shadow-sm p-6 sm:p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Алдаа гарлаа
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Хуульчийн мэдээлэл олдсонгүй. Дахин оролдоно уу.
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <div>ID: {String(id)}</div>
              {lawyerError?.message && <div>Error: {lawyerError.message}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lawyer = lawyerData.getLawyerById;
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 shadow-none sm:shadow-sm p-6 sm:p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-[#003366] mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Нэвтрэх шаардлагатай
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Та нэвтэрч орсны дараа цаг захиалах боломжтой.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display with better formatting
  const formatDate = (dateString: string) => {
    let date: Date;

    // Handle 'YYYY.M.D' format (e.g., '2025.7.26')
    if (/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(dateString)) {
      const [year, month, day] = dateString.split(".");
      date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      date = new Date(dateString);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Өнөөдөр";
    if (isTomorrow) return "Маргааш";

    return date.toLocaleDateString("mn-MN", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // Format time for display - normalize to full hours
  const formatTime = (timeString: string) => {
    const time = timeString.substring(0, 5); // HH:MM format
    const [hours, minutes] = time.split(":");

    // Convert 30-minute slots to full hour format for cleaner display
    if (minutes === "30") {
      const nextHour = String(parseInt(hours) + 1).padStart(2, "0");
      return `${nextHour}:00`;
    }

    return `${hours}:00`; // Always show as full hour
  };

  // Handle appointment creation
  const handleCreateAppointment = async () => {
    console.log(
      "Booking appointment for slot:",
      selectedSlot,
      "user:",
      currentUser,
      "userId:",
      currentUser?.id,
      "lawyerId:",
      lawyer._id,
      "specializationId:",
      selectedSpecializationId
    );
    if (!selectedSlot || !currentUser || !currentUser.id) {
      console.error("Missing required data for appointment:", {
        selectedSlot: !!selectedSlot,
        currentUser: !!currentUser,
        userId: currentUser?.id,
        userObject: currentUser,
      });
      setAppointmentStatus({
        type: "error",
        message: "Нэвтэрч орохоос өмнө цаг захиалах боломжгүй.",
      });
      return;
    }
    if (!selectedSpecializationId) {
      setAppointmentStatus({
        type: "error",
        message: "Та мэргэжлийн чиглэлээ сонгоно уу.",
      });
      return;
    }
    try {
      const appointmentInput = {
        clientId: currentUser.id,
        lawyerId: id,
        specializationId: selectedSpecializationId,
        slot: {
          day: selectedSlot.day,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
        notes: appointmentNotes.trim(),
      };

      console.log("Sending appointment input:", appointmentInput);

      await createAppointment({
        variables: {
          input: appointmentInput,
        },
      });
    } catch (error) {
      let message = "Appointment creation error: ";
      if (error instanceof Error) {
        message += error.message;
        if (error.message.includes("not available")) {
          message =
            "Сонгосон цаг аль хэдийн захиалагдсан байна эсвэл олдсонгүй.";
        }
      } else {
        message += String(error);
      }
      setAppointmentStatus({
        type: "error",
        message,
      });
      console.error("Appointment creation error:", error);
    }
  };

  // Group available slots by date - show next 14 days including today for better availability
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  const twoWeeksFromToday = new Date(today);
  twoWeeksFromToday.setDate(today.getDate() + 14);
  twoWeeksFromToday.setHours(23, 59, 59, 999); // Set to end of day

  const slots =
    availabilityData?.getAvailability?.[0]?.availableDays?.filter((slot) => {
      if (slot.booked) return false;

      // Parse the slot date
      let slotDate: Date;
      if (/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(slot.day)) {
        const [year, month, day] = slot.day.split(".");
        slotDate = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        slotDate = new Date(slot.day);
      }

      // Normalize slot date to start of day for comparison
      slotDate.setHours(0, 0, 0, 0);

      // Show slots from today onwards for the next 2 weeks
      return slotDate >= today && slotDate <= twoWeeksFromToday;
    }) || [];

  console.log("Available slots after filtering:", slots.length);
  console.log(
    "Date range:",
    today.toDateString(),
    "to",
    twoWeeksFromToday.toDateString()
  );

  const groupedSlots = slots.reduce(
    (acc: Record<string, AppointmentSlot[]>, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
      acc[slot.day].push(slot);
      return acc;
    },
    {}
  );

  return (
    <div className="">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 shadow-none sm:shadow-sm overflow-hidden">
          {/* Header Section */}
          <div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                <div className="relative group flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-4 border-white shadow-lg rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${lawyer.profilePicture}`.trim() ||
                        "/api/placeholder/120/120"
                      }
                      alt={`${lawyer.firstName} ${lawyer.lastName}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {lawyer.isOnline && (
                    <div className="absolute bottom-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 text-left space-y-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {lawyer.firstName} {lawyer.lastName}
                    </h1>

                    {/* {specializationsData?.getSpecializationsByLawyer && specializationsData.getSpecializationsByLawyer.length > 0 ? (
                      <div className="flex flex-wrap justify-start gap-2 mb-4">
                        {specializationsData.getSpecializationsByLawyer.map((spec) => (
                          <span
                            key={spec._id}
                            className="bg-[#003366] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-medium"
                          >
                            {spec.categoryName || spec.specializationId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">Мэргэжлийн чиглэл оруулаагүй байна</p>
                    )} */}

                    <div className="space-y-2 text-gray-600">
                      {lawyer.university && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm sm:text-base font-medium text-gray-700">
                            Их сургууль:
                          </span>
                          <span className="text-sm sm:text-base text-gray-600">
                            {lawyer.university}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2 justify-start items-center">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                        <a
                          href={`mailto:${lawyer.email}`}
                          className="hover:text-[#003366] transition-colors text-sm sm:text-base"
                        >
                          {lawyer.email}
                        </a>
                      </div>
                      <button
                        onClick={() => setShowReviews(!showReviews)}
                        className="flex gap-2 justify-start items-center hover:text-[#003366] transition-colors group"
                      >
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current text-yellow-400" />
                        <span className="text-sm sm:text-base group-hover:underline">
                          {lawyer.rating} ({lawyer.reviews || 0} үнэлгээ)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {lawyer.bio && (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4 max-w-2xl">
                  {lawyer.bio}
                </p>
              )}
            </div>
          </div>

          {/* Expandable Reviews Section */}
          {showReviews && (
            <div className="border-b border-gray-100">
              <div className="p-4 sm:p-6 lg:p-8 bg-gray-50">
                <div className="space-y-4 sm:space-y-6">
                  <div className="rounded-none sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 sm:border border-gray-100 shadow-none sm:shadow-sm bg-white">
                    <div className="text-center space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                          Үнэлгээ
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                          Нийт{" "}
                          <span className="font-bold text-[#003366]">
                            {lawyer.reviews || 0}
                          </span>{" "}
                          үнэлгээ
                        </p>
                      </div>

                      <div className="inline-flex items-center bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                  i < Math.floor(lawyer.rating)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-lg sm:text-2xl font-bold text-[#003366]">
                            {lawyer.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-gray-500">
                        Үйлчлүүлэгчдийн дундаж үнэлгээ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Section */}
          <div className="w-full">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-6 rounded-xl">
                <div className="text-center">
                  <button
                    onClick={() => setShowBookingSection(!showBookingSection)}
                    className="group w-full flex items-center justify-center gap-2 p-4 bg-[#003366] hover:bg-[#004080] rounded-md sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg sm:text-xl text-white">
                      Цаг захиалах
                    </h3>
                    <ChevronDown
                      className={`inline-block align-middle text-white transition-transform duration-300 ${
                        showBookingSection ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Collapsible Booking Content */}
                {showBookingSection && (
                  <div className="transition-all duration-500 ease-in-out">
                    {/* Specialization selector */}
                    <div className="mb-6 sm:mb-8">
                      <div className=" ">
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-base sm:text-lg font-semibold text-gray-900">
                            Мэргэжлийн чиглэл сонгох
                          </label>
                        </div>

                        {specializationsLoading ? (
                          <div className="flex items-center gap-2 py-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#003366]"></div>
                            <span className="text-gray-600">
                              Мэргэжлүүдийг ачааллаж байна...
                            </span>
                          </div>
                        ) : specializationsData?.getSpecializationsByLawyer &&
                          specializationsData.getSpecializationsByLawyer
                            .length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {specializationsData.getSpecializationsByLawyer.map(
                              (spec) => (
                                <button
                                  key={spec._id}
                                  onClick={() =>
                                    setSelectedSpecializationId(
                                      spec.specializationId
                                    )
                                  }
                                  className={`group p-4 border-2 rounded-md sm:rounded-xl text-left transition-all duration-200 ${
                                    selectedSpecializationId ===
                                    spec.specializationId
                                      ? "border-[#003366] bg-[#003366] text-white shadow-lg"
                                      : "border-gray-200 bg-white hover:border-[#003366] hover:shadow-md"
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h4
                                        className={`font-semibold text-sm sm:text-base mb-1 ${
                                          selectedSpecializationId ===
                                          spec.specializationId
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {spec.categoryName ||
                                          spec.specializationId}
                                      </h4>
                                      {(spec.pricePerHour ||
                                        spec.pricePerHour === 0) && (
                                        <div
                                          className={`flex items-center gap-1 text-xs sm:text-sm ${
                                            selectedSpecializationId ===
                                            spec.specializationId
                                              ? "text-blue-100"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          <span className="font-medium">
                                            Үнэ:
                                          </span>
                                          <span>
                                            {spec.pricePerHour === 0
                                              ? "Үнэгүй"
                                              : `${spec.pricePerHour.toLocaleString()}₮/цаг`}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {selectedSpecializationId ===
                                      spec.specializationId && (
                                      <div className="ml-2">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4 ">
                            <p className="text-gray-500">
                              Мэргэжлийн чиглэл байхгүй байна
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Messages */}
                    {appointmentStatus.type && (
                      <div
                        className={`p-4 sm:p-5 rounded-md sm:rounded-xl shadow-sm ${
                          appointmentStatus.type === "success"
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800"
                            : "bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              appointmentStatus.type === "success"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {appointmentStatus.type === "success" ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm sm:text-base">
                              {appointmentStatus.message}
                            </p>
                            <p className="text-xs sm:text-sm opacity-75">
                              {appointmentStatus.type === "success"
                                ? "Та цаг захиалгаа амжилттай хийлээ."
                                : "Дахин оролдож үзнэ үү."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Available Slots */}
                    {availabilityLoading ? (
                      <div className="text-center py-6 sm:py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366] mx-auto"></div>
                        <p className="mt-2 text-gray-600 text-sm sm:text-base">
                          Боломжит цагуудыг ачааллаж байна...
                        </p>
                      </div>
                    ) : Object.keys(groupedSlots).length > 0 ? (
                      <div className="space-y-4 sm:space-y-6">
                        {Object.entries(groupedSlots)
                          .sort(
                            ([a], [b]) =>
                              new Date(a).getTime() - new Date(b).getTime()
                          )
                          .map(([date, slots]) => (
                            <div
                              key={date}
                              className="bg-white border-0 sm:border-2 border-gray-200 rounded-md sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                              <div className="bg-gradient-to-r from-[#003366] to-[#004080] px-4 sm:px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-white text-base sm:text-lg">
                                      {formatDate(date)}
                                    </h4>
                                  </div>
                                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <span className="text-white text-xs sm:text-sm font-medium">
                                      {slots.length} цаг
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                                  {slots
                                    .sort((a, b) =>
                                      a.startTime.localeCompare(b.startTime)
                                    )
                                    .map((slot, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          setSelectedSlot(slot);
                                          setShowBookingModal(true);
                                        }}
                                        className="group relative p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-[#003366]/20 rounded-md sm:rounded-xl hover:border-[#003366] hover:from-[#003366] hover:to-[#004080] hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
                                      >
                                        <div className="flex flex-col items-center gap-1 text-[#003366] group-hover:text-white">
                                          <div className="text-xs sm:text-sm font-bold">
                                            {formatTime(slot.startTime)}
                                          </div>
                                          <div className="text-xs opacity-75">
                                            {formatTime(slot.endTime)}
                                          </div>
                                        </div>

                                        {/* Availability indicator */}
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full group-hover:bg-green-400"></div>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 sm:py-16">
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-md sm:rounded-2xl p-8 sm:p-12 border-2 border-dashed border-gray-300">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"></div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Боломжит цаг байхгүй
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base mb-4 max-w-md mx-auto">
                            Одоогоор энэ хуульчаас захиалах боломжтой цаг
                            байхгүй байна. Та дараа дахин шалгаж үзээрэй.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 justify-center text-xs sm:text-sm text-gray-500">
                            <span>
                              Зөвлөгөө: Хуульч өөрийн цагийн хуваарийг
                              тодорхойлсны дараа цаг харагдана
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-md sm:rounded-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto border border-[#003366]/30 shadow-[0_8px_32px_0_rgba(0,51,102,0.24)]">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Цаг захиалга баталгаажуулах
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-md sm:rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm sm:text-base">
                      Огноо: {formatDate(selectedSlot.day)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm sm:text-base">
                      Цаг: {formatTime(selectedSlot.startTime)} -{" "}
                      {formatTime(selectedSlot.endTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Нэмэлт тэмдэглэл (заавал биш)
                  </label>
                  <textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Танай асуудлын тухай товч мэдээлэл..."
                    className="w-full p-3 border border-gray-300 rounded-md sm:rounded-lg resize-none focus:ring-2 focus:ring-[#003366] focus:border-transparent text-sm sm:text-base"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSlot(null);
                    setAppointmentNotes("");
                  }}
                  className="w-full sm:flex-1 px-6 py-4 border-2 border-gray-300 rounded-md sm:rounded-xl font-bold text-gray-700 
                           hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-base shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Цуцлах
                  </div>
                </button>
                <button
                  onClick={handleCreateAppointment}
                  disabled={creatingAppointment}
                  className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-md sm:rounded-xl 
                           font-bold hover:from-[#004080] hover:to-[#0066cc] disabled:from-gray-300 disabled:to-gray-400 
                           disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                           text-base shadow-lg hover:shadow-xl border-2 border-transparent hover:border-white/20"
                >
                  {creatingAppointment ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Захиалж байна...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Захиалах
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerProfile;
