import { QueryResolvers } from "@/types/generated";
import { Notification } from "@/models";

export const notificationCount: QueryResolvers["notificationCount"] = async (
    _,
    { unreadOnly },
    context
  ) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }
    const query: any = { recipientId: context.userId };
    if (unreadOnly) {
      query.read = false;
    }
    return await Notification.countDocuments(query);
  };