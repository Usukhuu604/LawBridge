import { Notification, toGqlNotification } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const markNotificationAsRead: MutationResolvers["markNotificationAsRead"] =
  async (_, { notificationId }, context) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    if (notification.recipientId !== context.userId) {
      throw new Error("Not allowed");
    }

    notification.read = true;
    await notification.save();
    return toGqlNotification(notification);
  };