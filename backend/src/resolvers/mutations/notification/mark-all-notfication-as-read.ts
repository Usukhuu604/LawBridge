import { Notification } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const markAllNotificationsAsRead: MutationResolvers["markAllNotificationsAsRead"] =
  async (_, __, context) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }

    await Notification.updateMany(
      { recipientId: context.userId, read: false },
      { read: true }
    );
    return true;
  };