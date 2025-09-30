import { MutationResolvers } from "@/types/generated";
import { Message } from "@/models/message.model";

export const deleteAllMessages: MutationResolvers["deleteAllMessages"] = async (
  _,
  { chatRoomId },
  context
) => {
  try {
    // Check if user is authenticated
    if (!context.userId) {
      throw new Error("Authentication required");
    }

    // Find the message document for this chat room
    const messageDoc = await Message.findOne({ chatRoomId });

    if (!messageDoc) {
      // No messages found, return true (nothing to delete)
      return true;
    }

    // Clear all messages from the ChatRoomsMessages array
    await Message.findOneAndUpdate(
      { chatRoomId },
      { $set: { ChatRoomsMessages: [] } },
      { new: true }
    );

    return true;
  } catch (error) {
    console.error("Error deleting all messages:", error);
    throw new Error("Failed to delete messages");
  }
};
