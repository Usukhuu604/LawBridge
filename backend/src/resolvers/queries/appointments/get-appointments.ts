import { Appointment } from "@/models";
import { QueryResolvers, AppointmentStatus } from "@/types/generated";

export const getAppointments: QueryResolvers["getAppointments"] = async () => {
  interface Appointment {
    _id?: { toString: () => string };
    clientId?: string;
    lawyerId?: string;
    schedule?: string;
    status?: string;
    chatRoomId?: { toString: () => string } | null;
  }

  const appointments: Appointment[] = [];

  const docs = await Appointment.find();
  for (const doc of docs) {
    const obj = doc.toObject();
    appointments.push({
      ...obj,
      _id: obj._id?.toString?.(),
      clientId: obj.clientId?.toString?.(),
      lawyerId: obj.lawyerId?.toString?.(),
      chatRoomId: obj.chatRoomId ? obj.chatRoomId.toString() : undefined,
    });
  }

  return appointments
    .filter((appointment): appointment is Appointment => !!appointment)
    .map((appointment) => ({
      _id: appointment._id?.toString?.() ?? "",
      clientId: appointment.clientId ?? "",
      lawyerId: appointment.lawyerId ?? "",
      schedule: appointment.schedule ?? "",
      status:
        (appointment.status as AppointmentStatus) ?? AppointmentStatus.Pending,
      chatRoomId: appointment.chatRoomId
        ? appointment.chatRoomId.toString()
        : undefined,
    }));
};
