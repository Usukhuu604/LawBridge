import { Schema, model, Model, models, Document, Types } from "mongoose";
import { NotificationType, Notification as GqlNotification } from "@/types/generated";

// This interface represents the document in MongoDB, including Mongoose properties.
export interface INotificationDocument extends Document {
  _id: Types.ObjectId; // This explicitly types the _id field.
  recipientId: string;
  type: NotificationType;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// This type represents a plain JavaScript object version of our document.
export type NotificationSchemaType = Omit<INotificationDocument, keyof Document | '_id'> & {
  id: string;
  _id: Types.ObjectId; // Also include it here for consistency
};

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This will now work because INotificationDocument specifies the type of _id.
NotificationSchema.virtual("id").get(function (this: INotificationDocument) {
  return this._id.toHexString();
});

export const Notification =
  (models.Notification as Model<INotificationDocument>) ||
  model<INotificationDocument>("Notification", NotificationSchema);


/**
 * Maps a Mongoose document or plain object to the GraphQL Notification type.
 */
export const toGqlNotification = (notification: NotificationSchemaType | INotificationDocument): GqlNotification => {
  const plainObject = 'toObject' in notification ? notification.toObject() : notification;

  if (!plainObject.id || !plainObject.createdAt) {
    throw new Error("Cannot map notification: source object is missing 'id' or 'createdAt'.");
  }

  return {
    __typename: "Notification",
    id: plainObject.id,
    recipientId: plainObject.recipientId,
    type: plainObject.type,
    content: plainObject.content,
    read: plainObject.read ?? false,
    createdAt: plainObject.createdAt,
  };
};