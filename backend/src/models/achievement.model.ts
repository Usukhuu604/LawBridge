import { Schema, model, Model, models } from "mongoose";

export type AchievementSchemaType = {
  title: string;
  description: string;
  threshold: number;
  icon: string;
};

const AchievementSchema = new Schema<AchievementSchemaType>({
  title: String,
  description: String,
  threshold: Number,
  icon: String,
});

export const Achievement: Model<AchievementSchemaType> =
  models["Achievement"] || model("Achievement", AchievementSchema);
