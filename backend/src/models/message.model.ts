import { Schema, model, Model, models, Types } from "mongoose";

enum MediaType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
}

type ChatRoomsMessagesType = {
  userId: string;
  type: MediaType;
  content: string;
  createdAt?: Date;
};

type MessageSchemaType = {
  chatRoomId: string;
  ChatRoomsMessages: ChatRoomsMessagesType[];
};

const ChatRoomsMessagesSchema = new Schema<ChatRoomsMessagesType>({
  userId: { type: String, required: true },
  type: { type: String, enum: Object.values(MediaType), required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new Schema<MessageSchemaType>(
  {
    chatRoomId: { type: String },
    ChatRoomsMessages: [ChatRoomsMessagesSchema],
  },
  { timestamps: true }
);

export const Message: Model<MessageSchemaType> =
  models["Message"] || model("Message", MessageSchema);
