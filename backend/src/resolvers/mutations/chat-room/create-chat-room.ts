import { ChatRoom } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const createChatRoomAfterAppointment: MutationResolvers["createChatRoomAfterAppointment"] =
  async (_, { input }) => {
    const { participants, appointmentId, allowedMedia } = input;

    const newRoomDoc = await ChatRoom.create({
      participants,
      appointmentId,
      allowedMedia: allowedMedia ?? "TEXT",
    });

    // Convert _id to string to match GraphQL type and ensure allowedMedia is an AllowedMediaEnum value
    const newRoom = {
      ...newRoomDoc.toObject(),
      _id: newRoomDoc._id.toString(),
      allowedMedia: (typeof newRoomDoc.allowedMedia === "string" ? newRoomDoc.allowedMedia : "TEXT"),
    };

    return newRoom as unknown as import("@/types/generated").ChatRoom;
  };
