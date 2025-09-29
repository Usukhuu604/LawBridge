import { ObjectId } from "mongodb";
import { QueryResolvers } from "@/types/generated";

type GetAppointmentByIdArgs = { id: string };

export const getAppointmentById: QueryResolvers["getAppointmentById"] = async (
  _parent,
  { id }: GetAppointmentByIdArgs,
  context
) => {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid appointment ID: ${id}`);
  }

  const appointment = await context.db
    .collection("appointments")
    .findOne({ _id: new ObjectId(id) });

  if (!appointment) {
    throw new Error(`Appointment with ID ${id} not found`);
  }

  return {
    id: appointment._id.toString(),
    clientId: appointment.clientClerkId ?? "",
    lawyerId: appointment.lawyerId?.toString?.() ?? "",
    schedule:
      appointment.schedule instanceof Date
        ? appointment.schedule.toISOString()
        : appointment.schedule ?? "",
    status: appointment.status,
    chatRoomId: appointment.chatRoomId?.toString?.() ?? null,
    createdAt: appointment.createdAt?.toISOString?.() ?? "",
    endedAt: appointment.endedAt?.toISOString?.() ?? "",
    slot: appointment.slot ?? {
      day: "",
      startTime: "",
      endTime: "",
      booked: false,
    },
    specializationId: appointment.specializationId?.toString?.() ?? "",
    subscription: appointment.subscription ?? false,
    // Add other required fields as needed
  };
};
