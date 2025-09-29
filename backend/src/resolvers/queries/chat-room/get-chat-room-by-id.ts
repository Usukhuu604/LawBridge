import { QueryResolvers } from "@/types/generated";
import { ObjectId } from "mongodb";

export const getChatRoomById: QueryResolvers["getChatRoomById"] = async (
  parent: unknown,
  { _id }, context
) => {

  const chatRoom = await context.db
    .collection("chatrooms")
    .findOne({ _id: new ObjectId(_id) });

  if (!chatRoom) {
    throw new Error("Chat room not found");
  }

  const mappedChatRoom = {
    _id: chatRoom._id.toString(),
    appointmentId: chatRoom.appointmentId,
    participants: chatRoom.participants,
    allowedMedia: chatRoom.allowedMedia,
  };

  return mappedChatRoom;
};
