import { QueryResolvers, AppointmentStatus } from "@/types/generated";
import { Appointment } from "@/models";
import { LawyerSpecialization } from "@/models/lawyer-specialization.model";

export const getAppointmentById: QueryResolvers["getAppointmentById"] = async (
  _,
  { id }
) => {
  // 1. Fetch the appointment by ID
  const appointment = await Appointment.findById(id).lean();
  console.log('Fetched appointment:', appointment);
  if (!appointment) {
    return null;
  }

  // 2. Fetch and populate LawyerSpecialization and nested Specialization
  console.log('Appointment.specializationId:', appointment.specializationId);
  let lawyerSpec = null;
  let nestedSpec = null;
  if (appointment.specializationId) {
    lawyerSpec = await LawyerSpecialization.findById(appointment.specializationId)
      .populate("specializationId")
      .lean();
    console.log('Fetched lawyerSpec:', lawyerSpec);
    nestedSpec = lawyerSpec?.specializationId as any;
  }

  // 3. Always return a non-null slot object
  let slotObj;
  if (
    appointment.slot &&
    typeof appointment.slot === "object" &&
    typeof appointment.slot.day === "string" &&
    typeof appointment.slot.startTime === "string" &&
    typeof appointment.slot.endTime === "string"
  ) {
    slotObj = {
      day: appointment.slot.day,
      startTime: appointment.slot.startTime,
      endTime: appointment.slot.endTime,
      booked: Boolean(appointment.slot.booked),
    };
  } else {
    slotObj = {
      day: "",
      startTime: "",
      endTime: "",
      booked: false,
    };
  }

  // 4. Build the specialization object if available
  let specializationObj = null;
  if (lawyerSpec) {
    specializationObj = {
      _id: (lawyerSpec as any)?._id ? String((lawyerSpec as any)._id) : "",
      lawyerId: (lawyerSpec as any)?.lawyerId ? String((lawyerSpec as any).lawyerId) : "",
      specializationId:
        (lawyerSpec as any)?.specializationId && (lawyerSpec as any).specializationId._id
          ? String((lawyerSpec as any).specializationId._id)
          : (lawyerSpec as any)?.specializationId
          ? String((lawyerSpec as any).specializationId)
          : "",
      categoryName: nestedSpec?.categoryName ?? "",
      pricePerHour: (lawyerSpec as any)?.pricePerHour ?? 0,
      subscription: Boolean((lawyerSpec as any)?.subscription),
    };
  }

  // 5. Return the full Appointment object
  return {
    id: appointment._id?.toString?.() ?? "",
    clientId: appointment.clientId?.toString?.() ?? "",
    lawyerId: appointment.lawyerId?.toString?.() ?? "",
    status: appointment.status as unknown as AppointmentStatus,
    chatRoomId: appointment.chatRoomId?.toString?.() ?? null,
    schedule: appointment.schedule,
    subscription: Boolean(lawyerSpec?.subscription),
    specializationId: lawyerSpec?._id ? String(lawyerSpec._id) : "",
    slot: slotObj,
    specialization: specializationObj,
    createdAt: appointment.createdAt ? new Date(appointment.createdAt).toISOString() : "",
    endedAt: appointment.endedAt ? new Date(appointment.endedAt).toISOString() : "",
    notes: appointment.notes ?? "",
  };
};
