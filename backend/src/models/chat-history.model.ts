import { Schema, model, models, Document } from "mongoose";

export interface IChatHistory extends Document {
  userId: string;
  sessionId: string;
  userMessage: string;
  botResponse: string;
  createdAt: Date;
}

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    userId: { type: String, required: true },
    sessionId: { type: String, required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const ChatHistory =
  models.ChatHistory || model<IChatHistory>("ChatHistory", ChatHistorySchema);
