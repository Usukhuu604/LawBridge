import { MutationResolvers } from "@/types/generated";
import { clearChatHistory as clearHistoryUtil } from "@/lib/langchain";

export const clearChatHistory: MutationResolvers["clearChatHistory"] = async (
  _,
  { userId }
) => {
  try {
    await clearHistoryUtil(userId);
    return true;
  } catch (error) {
    console.error("❌ Error clearing chat history:", error);
    return false;
  }
}; 