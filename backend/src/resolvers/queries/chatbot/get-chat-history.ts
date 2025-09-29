import { QueryResolvers } from "@/types/generated";
import { ChatHistory } from "@/models/chat-history.model";

export const getChatHistoryByUser: QueryResolvers["getChatHistoryByUser"] = async (
  _,
  { userId }
) => {
  try {
    const history = await (ChatHistory as any)
      .find({ userId })
      .sort({ createdAt: -1 });
    return history.map((doc) => ({
      _id: doc._id.toString(),
      userId: doc.userId,
      sessionId: doc.sessionId,
      userMessage: doc.userMessage,
      botResponse: doc.botResponse,
      createdAt: doc.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("❌ Error fetching chat history:", err);
    throw new Error("Failed to fetch chat history");
  }
};
