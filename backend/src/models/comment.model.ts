import { Schema, model, models, Types, Model } from "mongoose";

type CommentSchemaType = {
  post: Types.ObjectId;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const CommentSchema = new Schema<CommentSchemaType>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment: Model<CommentSchemaType> =
 models.Comment || model<CommentSchemaType>("Comment", CommentSchema);
 