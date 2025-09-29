// models/LawyerSpecialization.ts
import { Schema, model, models, Model } from "mongoose";

export type lawyerSpecializationType = {
  lawyerId: string;
  specializationId: Schema.Types.ObjectId;
  pricePerHour: number;
  subscription: boolean;
};

const lawyerSpecializationSchema = new Schema<lawyerSpecializationType>({
  lawyerId: { type: String, required: true },
  specializationId: { type: Schema.Types.ObjectId, ref: "Specialization", required: true },
  pricePerHour: { type: Number, required: true , default: 0},
  subscription: { type: Boolean, required: true },
});

export const LawyerSpecialization: Model<lawyerSpecializationType> =
  models.LawyerSpecialization ||
  model("LawyerSpecialization", lawyerSpecializationSchema);
