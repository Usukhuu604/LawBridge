import { Appointment } from "@/models";
import { QueryResolvers, AppointmentStatus } from "@/types/generated";

export const getAppointmentsByLawyer: QueryResolvers["getAppointmentsByLawyer"] =
  async (_, { lawyerId }, context) => {
    try {
      if (!lawyerId) {
        throw new Error("Lawyer ID is required");
      }

      const docs = await Appointment.find({ lawyerId }).populate(
        "specializationId"
      );

      return docs.map((doc) => {
        const obj = doc.toObject();
        return {
          id: obj._id?.toString() || "",
          clientId: obj.clientId || "",
          lawyerId: obj.lawyerId || "",
          status: obj.status || "PENDING",
          chatRoomId: obj.chatRoomId?.toString() || null,
          specializationId: obj.specializationId?.toString() || "",
          slot: {
            day: obj.slot?.day || "",
            startTime: obj.slot?.startTime || "",
            endTime: obj.slot?.endTime || "",
            booked: obj.slot?.booked || false,
          },
          notes: obj.notes || "",
          createdAt: obj.createdAt?.toISOString() || new Date().toISOString(),
          price: null, // Add default values for optional fields
          subscription: false,
          endedAt: obj.endedAt?.toISOString() || null,
          specialization: obj.specializationId
            ? {
                _id: obj.specializationId._id?.toString() || "",
                lawyerId: obj.specializationId.lawyerId?.toString() || "",
                specializationId:
                  obj.specializationId.specializationId?.toString() || "",
                categoryName: obj.specializationId.categoryName || "",
                subscription: obj.specializationId.subscription || false,
                pricePerHour: obj.specializationId.pricePerHour || 0,
              }
            : null,
        };
      });
    } catch (error) {
      console.error("Error fetching appointments by lawyer:", error);
      return [];
    }
  };
