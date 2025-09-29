import { Schema, model, Model, models, Types } from "mongoose";

enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

type AppointmentSchemaType = {
  clientId: string;
  lawyerId: string;
  schedule: string;
  status: AppointmentStatus;
  chatRoomId?: Types.ObjectId;
  specializationId: Types.ObjectId;
  slot: {
    day: string;
    startTime: string;
    endTime: string;
    booked: boolean;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  endedAt: Date;
};

const AppointmentSchema = new Schema<AppointmentSchemaType>(
  {
    clientId: { type: String, required: true },
    lawyerId: { type: String, required: true },
    schedule: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
      required: true,
    },
    chatRoomId: { type: Schema.Types.ObjectId, ref: "ChatRoom" },
    specializationId: {
      type: Schema.Types.ObjectId,
      ref: "LawyerSpecialization",
      required: true,
    },
    slot: {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      booked: { type: Boolean, default: true },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Appointment: Model<AppointmentSchemaType> =
  models["Appointment"] || model("Appointment", AppointmentSchema);
