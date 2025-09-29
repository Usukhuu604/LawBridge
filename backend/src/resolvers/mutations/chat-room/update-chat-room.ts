import { ChatRoom } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const updateChatRoom: MutationResolvers["updateChatRoom"] = async (
  _,
  { input },
  context
) => {
  const { _id, participants, appointmentId, allowedMedia } = input;

  const updateFields: any = {};
  if (participants !== undefined) updateFields.participants = participants;
  if (appointmentId !== undefined) updateFields.appointmentId = appointmentId;
  if (allowedMedia !== undefined) updateFields.allowedMedia = allowedMedia;

  const updatedChatRoom = await ChatRoom.findByIdAndUpdate(_id, updateFields, {
    new: true,
  });

  if (!updatedChatRoom) {
    throw new Error("ChatRoom not found");
  }

  // Convert _id to string to match GraphQL type
  const chatRoomObj = updatedChatRoom.toObject();

  return chatRoomObj as unknown as import("@/types/generated").ChatRoom;
};
