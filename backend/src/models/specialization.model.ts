// models/Specialization.ts
import { Schema, model, models } from "mongoose";

const specializationSchema = new Schema({
  categoryName: { type: String, required: true, unique: true },
});

export const Specialization =
  models.Specialization || model("Specialization", specializationSchema);
