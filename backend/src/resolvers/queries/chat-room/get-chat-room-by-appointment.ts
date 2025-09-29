import { QueryResolvers } from "@/types/generated";
import { ObjectId } from "mongodb";

export const getChatRoomsByAppointment: QueryResolvers["getChatRoomsByAppointment"] =
  async (parent: unknown, { appointmentId }, context) => {
 
    const appointmentObjectId = new ObjectId(appointmentId);

    const chatRoom = await context.db
      .collection("chatrooms")
      .findOne({ appointmentId: appointmentObjectId });

    if (!chatRoom) {
      throw new Error("Chat room not found for the given appointment");
    }

    return [
      {
        _id: chatRoom._id.toString(),
        appointmentId: chatRoom.appointmentId.toString(),
        participants: chatRoom.participants,
        allowedMedia: chatRoom.allowedMedia,
      },
    ];
  };
