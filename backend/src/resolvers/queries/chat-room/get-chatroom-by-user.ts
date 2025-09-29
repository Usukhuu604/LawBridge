import { ChatRoom } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getChatRoomByUser: QueryResolvers["getChatRoomByUser"] = async (
  _,
  { userId }
) => {
  const rooms = await ChatRoom.find({ participants: userId }).lean();
  return rooms.map((room: any) => ({
    _id: room._id.toString(),
    participants: room.participants,
    appointmentId: room.appointmentId.toString(),
    allowedMedia: room.allowedMedia,
  }));
};
