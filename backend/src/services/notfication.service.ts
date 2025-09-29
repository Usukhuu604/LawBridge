import { clerkClient } from "@clerk/clerk-sdk-node";
import { GraphQLError } from "graphql";
import { Notification, toGqlNotification } from "@/models";
import { CreateNotificationInput, Notification as GqlNotification } from "@/types/generated";

export class NotificationService {
  /**
   * Creates a notification, validates the recipient, and can trigger side-effects.
   * @param input The data for the new notification from the GraphQL mutation.
   * @param actorId The Clerk ID of the user performing the action.
   * @returns A promise that resolves to the GraphQL Notification type.
   */
  public static async create(
    input: CreateNotificationInput,
    actorId: string
  ): Promise<GqlNotification> {
    const { recipientId, content, type } = input;

    try {
      await clerkClient.users.getUser(recipientId);
    } catch (error) {
      console.error(`Attempt to create notification for non-existent user: ${recipientId}`);
      throw new GraphQLError(`Recipient user with ID '${recipientId}' does not exist.`, {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    
    const newNotification = await Notification.create({
      recipientId,
      content,
      type,
    });

    // TODO: Trigger side-effects here (email, WebSocket push, etc.)

    return toGqlNotification(newNotification);
  }
}