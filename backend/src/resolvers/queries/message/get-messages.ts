import { Message } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getMessages: QueryResolvers["getMessages"] = async (
  _,
  { chatRoomId }
) => {
  const messages = await (Message as any).findOne({ chatRoomId });

  // If no messages found, return empty array
  if (!messages) {
    return [
      {
        chatRoomId,
        ChatRoomsMessages: [],
      },
    ];
  }

  return [
    {
      chatRoomId,
      ChatRoomsMessages: messages.ChatRoomsMessages.map((msg: any) => ({
        _id: msg._id?.toString(),
        userId: msg.userId,
        type: msg.type,
        content: msg.content,
        createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : "",
      })),
    },
  ];
};
