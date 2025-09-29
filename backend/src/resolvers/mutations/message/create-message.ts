// src/resolvers/message/createMessage.ts

import { MutationResolvers, MediaType } from "@/types/generated";
import { Message } from "@/models/message.model";

export const createMessage: MutationResolvers["createMessage"] = async (
  _,
  { chatRoomId, userId, type, content }
) => {
  const newMsg = {
    userId,
    type: type as unknown as MediaType,
    content: content ?? "",
    createdAt: new Date(),
  };

  // Try to push to existing document
  let msgDoc = await Message.findOneAndUpdate(
    { chatRoomId },
    { $push: { ChatRoomsMessages: newMsg } },
    { new: true }
  ).lean();

  // If not found, create new document
  if (!msgDoc) {
    msgDoc = await Message.create({
      chatRoomId,
      ChatRoomsMessages: [newMsg],
    });
    msgDoc = (msgDoc as any).toObject();
  }

  return {
    chatRoomId: msgDoc.chatRoomId,
    ChatRoomsMessages: msgDoc.ChatRoomsMessages.map((msg: any) => ({
      _id: msg._id?.toString(),
      userId: msg.userId,
      type: msg.type as unknown as MediaType,
      content: msg.content,
      createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : "",
    })),
  };
};
