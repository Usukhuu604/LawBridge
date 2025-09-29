import { MutationResolvers } from "@/types/generated";
import { ChatHistory } from "@/models/chat-history.model";
import { chatWithBot } from "@/lib/langchain";
// энэ нь OpenAI/LangChain chatbot функцийг дуудаж хариу авдаг функц

export const saveChatHistory: MutationResolvers["saveChatHistory"] = async (
  _,
  { input },
  context
) => {
  try {
    const { sessionId, userMessage } = input;
    const userId = context.userId;

    // ⬇️ Bot response-г бодитоор гаргаж авах
    const botResponse = await chatWithBot(userMessage, userId);

    // ⬇️ Хадгалах
    const chatHistoryDoc = new ChatHistory({
      sessionId,
      userMessage,
      botResponse: botResponse || "",
      userId: userId || "",
    });
    await chatHistoryDoc.save();

    return {
      _id: chatHistoryDoc._id.toString(),
      userId: chatHistoryDoc.userId,
      sessionId: chatHistoryDoc.sessionId,
      userMessage: chatHistoryDoc.userMessage,
      botResponse: chatHistoryDoc.botResponse,
      createdAt: chatHistoryDoc.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("❌ Error saving chat history:", error);
    throw new Error("Failed to save chat history");
  }
};
