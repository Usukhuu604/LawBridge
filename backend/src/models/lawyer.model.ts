// /models/lawyer.model.ts

import { Schema, model, models, Model, Types } from "mongoose";

export enum VerifiedStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface LawyerSchemaType {
  id?: string;
  lawyerId: string;
  clerkUserId: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  bio?: string;
  university: string;
  specialization: Types.ObjectId[];
  achievements: Types.ObjectId[];
  status: VerifiedStatus;
  document?: string;
  rating?: number;
  profilePicture: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// === FIX #2: THE MONGOOSE SCHEMA CONFIGURATION ===
const LawyerSchema = new Schema<LawyerSchemaType>(
  {
    lawyerId: {
      type: String,
      required: [true, "A Clerk User ID is required to create a lawyer."],
      unique: true,
    },
    clerkUserId: { type: String, required: true, unique: true },
    clientId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true },
    specialization: [
      { type: Schema.Types.ObjectId, ref: "LawyerSpecialization" },
    ],
    bio: { type: String, required: false },
    // category
    achievements: [{ type: Schema.Types.ObjectId, ref: "Achievement" }],
    status: {
      type: String,
      enum: Object.values(VerifiedStatus),
      default: VerifiedStatus.PENDING,
      required: true,
    },
    university: { type: String, required: false },
    document: { type: String, required: false },
    rating: { type: Number },
    profilePicture: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

LawyerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Lawyer =
  (models.Lawyer as Model<LawyerSchemaType>) ||
  model<LawyerSchemaType>("Lawyer", LawyerSchema);
