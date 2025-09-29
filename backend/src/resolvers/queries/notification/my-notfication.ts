import { Notification } from "@/models";
import { Notification as GqlNotification } from "@/types/generated"; // GraphQL Notification type

export const myNotifications = async (_parent, _args, context): Promise<GqlNotification[]> => {
  if (!context.userId) throw new Error("Unauthorized");

  const notifications = await Notification.find({ recipientId: context.userId }).sort({ createdAt: -1 });

  // Mongoose документ -> GraphQL төрлийн объект руу хөрвүүлэх
  return notifications.map((notif) => ({
    id: notif._id.toString(),        // Mongo _id-г GraphQL-д id болгож хөрвүүлнэ
    recipientId: notif.recipientId,
    type: notif.type,
    content: notif.content,
    read: notif.read,
    createdAt: notif.createdAt,
  }));
};
