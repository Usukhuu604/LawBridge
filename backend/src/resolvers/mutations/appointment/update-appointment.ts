// import {
//   MutationResolvers,
//   Appointment as AppointmentType,
//   AppointmentStatus,
// } from "@/types/generated";
// import { Appointment } from "@/models";
// import { GraphQLError } from "graphql";

// /**
//  * Updates an appointment with the given ID and input data.
//  */
// export const updateAppointment: MutationResolvers["updateAppointment"] = async (
//   _,
//   { id, input }
// ) => {
//   try {
//     const updatedAppointmentDoc = await Appointment.findByIdAndUpdate(
//       id,
//       { $set: input },
//       { new: true, runValidators: true }
//     );

//     if (!updatedAppointmentDoc) {
//       throw new GraphQLError("Appointment not found", {
//         extensions: { code: "NOT_FOUND" },
//       });
//     }

//     const appointment: AppointmentType = {
//       lawyerId: updatedAppointmentDoc.lawyerId.toString(),
//       clientId: updatedAppointmentDoc.clientId,
//       schedule: updatedAppointmentDoc.schedule,
//       status: updatedAppointmentDoc.status as unknown as AppointmentStatus,
//       isFree: updatedAppointmentDoc.isFree,
//       price: updatedAppointmentDoc.price,
//       chatRoomId: updatedAppointmentDoc.chatRoomId?.toString() || null,
//       specializationId: updatedAppointmentDoc.specializationId.toString(),
//       createdAt: updatedAppointmentDoc.createdAt.toISOString(),
//       updatedAt: updatedAppointmentDoc.updatedAt.toISOString(),
//       endedAt: updatedAppointmentDoc.endedAt.toISOString(),
//     };

//     return appointment;
//   } catch (error) {
//     console.error("❌ Error updating appointment:", error);
//     if (error instanceof GraphQLError) {
//       throw error;
//     }
//     throw new Error("Failed to update appointment");
//   }
// };
