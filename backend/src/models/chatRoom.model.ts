import { Schema, model, Model, models, Types } from "mongoose";

type ChatRoomSchemaType = {
    participants: string[];
    appointmentId: Types.ObjectId;
    allowedMedia?: string; 
};

const ChatRoomSchema = new Schema<ChatRoomSchemaType>({
    participants: [{ type: String }], // Clerk ID-уудаар хадгална
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    allowedMedia: { type: String, },
  },{timestamps: true});
  
  export const ChatRoom: Model<ChatRoomSchemaType> =
    models["ChatRoom"] || model("ChatRoom", ChatRoomSchema);