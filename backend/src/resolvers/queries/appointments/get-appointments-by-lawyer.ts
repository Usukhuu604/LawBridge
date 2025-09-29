import { ObjectId } from "mongodb";
import { AppointmentStatus, QueryResolvers } from "@/types/generated";

export const getAppointmentsByLawyer: QueryResolvers["getAppointmentsByLawyer"] =
  async (_, { lawyerId }, context) => {
    if (!lawyerId) {
      throw new Error("Lawyer ID is required");
    }

    const appointments = await context.db
      .collection("appointments")
      .find({ lawyerId: new ObjectId(lawyerId) })
      .toArray();

    if (!appointments || appointments.length === 0) {
      throw new Error("No appointments found for the specified lawyer.");
    }

    return appointments.map((appointment: any) => ({
      _id: appointment._id.toString(),
      clientId: appointment.clientClerkId ?? "",
      lawyerId: appointment.lawyerId.toString?.() ?? "",
      schedule: appointment.schedule ?? "",
      status: Object.values(AppointmentStatus).includes(appointment.status)
        ? (appointment.status as AppointmentStatus)
        : AppointmentStatus.Pending,
      chatRoomId: appointment.chatRoomId?.toString?.(),
    }));
  };
