import { Schema, model, Model, models, Types } from "mongoose";

type ReviewSchemaType = {
  clientId: string;
  lawyerId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReviewSchema = new Schema<ReviewSchemaType>(
  {
    clientId: { type: String, required: true },
    lawyerId: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export const Review: Model<ReviewSchemaType> =
  models.Review || model<ReviewSchemaType>("Review", ReviewSchema);
