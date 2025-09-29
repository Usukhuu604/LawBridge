import { Appointment, ChatRoom } from "@/models";
import { LawyerSpecialization } from "@/models/lawyer-specialization.model";
import { AvailabilitySchedule } from "@/models/availability.model";
import { MutationResolvers, AppointmentStatus } from "@/types/generated";

export const createAppointment: MutationResolvers["createAppointment"] = async (
  _,
  { input },
  context
) => {
  try {
    const { lawyerId, specializationId, slot, notes } = input;
    const { day, startTime, endTime } = slot;

    // 1. Atomically check and book the slot
    const availability = await (AvailabilitySchedule as any).findOneAndUpdate(
      {
        lawyerId,
        "availableDays.day": day,
        "availableDays.startTime": startTime,
        "availableDays.endTime": endTime,
        "availableDays.booked": false,
      },
      { $set: { "availableDays.$.booked": true } },
      { new: true }
    );

    if (!availability) {
      throw new Error("Selected time slot is not available for this lawyer.");
    }

    // 2. Find the correct LawyerSpecialization by lawyerId and specializationId
    const lawyerSpecDoc = await LawyerSpecialization.findOne({
      lawyerId,
      specializationId,
    });

    if (!lawyerSpecDoc) {
      throw new Error(
        "LawyerSpecialization not found for the given lawyer and specialization."
      );
    }

    // 3. Create the appointment using the _id of the LawyerSpecialization
    const appointmentDoc = await Appointment.create({
      clientId: context.userId,
      lawyerId,
      schedule: new Date().toISOString(),
      status: "PENDING",
      isFree: false,
      specializationId: lawyerSpecDoc._id, // <-- Use LawyerSpecialization _id
      slot: { day, startTime, endTime, booked: true },
      notes,
    });

    // 4. Create chatroom
    const chatRoomDoc = await ChatRoom.create({
      participants: [context.userId, lawyerId.toString()],
      appointmentId: appointmentDoc._id,
    });

    appointmentDoc.chatRoomId = chatRoomDoc._id;
    await appointmentDoc.save();

    // 5. Populate specialization info
    const lawyerSpec = await LawyerSpecialization.findById(lawyerSpecDoc._id)
      .populate("specializationId")
      .lean();
    const nestedSpec = lawyerSpec?.specializationId as any;

    let specializationObj = null;
    if (lawyerSpec) {
      specializationObj = {
        _id: (lawyerSpec as any)?._id ? String((lawyerSpec as any)._id) : "",
        lawyerId: (lawyerSpec as any)?.lawyerId
          ? String((lawyerSpec as any).lawyerId)
          : "",
        specializationId:
          (lawyerSpec as any)?.specializationId &&
          (lawyerSpec as any).specializationId._id
            ? String((lawyerSpec as any).specializationId._id)
            : (lawyerSpec as any)?.specializationId
            ? String((lawyerSpec as any).specializationId)
            : "",
        categoryName: nestedSpec?.categoryName ?? "",
        pricePerHour: (lawyerSpec as any)?.pricePerHour ?? 0,
        subscription: Boolean((lawyerSpec as any)?.subscription),
      };
    }

    return {
      id: appointmentDoc._id.toString(),
      lawyerId: appointmentDoc.lawyerId.toString(),
      clientId: appointmentDoc.clientId.toString(),
      schedule: appointmentDoc.schedule,
      status: appointmentDoc.status as unknown as AppointmentStatus,
      specializationId: String(lawyerSpecDoc._id),
      chatRoomId: chatRoomDoc._id.toString(),
      createdAt: appointmentDoc.createdAt?.toISOString() ?? "",
      endedAt: appointmentDoc.endedAt?.toISOString() ?? "",
      subscription: Boolean(lawyerSpec?.subscription),
      slot: { day, startTime, endTime, booked: true },
      specialization: specializationObj,
      notes: appointmentDoc.notes ?? "",
    };
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    throw new Error("Failed to create appointment");
  }
};
