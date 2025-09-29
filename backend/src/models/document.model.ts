import { Schema, model, Model, models, Types } from "mongoose";

enum DocumentMediaType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
}

enum ReviewStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  REJECTED = "REJECTED",
}

type DocumentSchemaType = {
  clientId: string;
  lawyerId?: Types.ObjectId;
  images: string[];
  title: string;
  content?: string;
  type?: DocumentMediaType;
  status?: ReviewStatus;
  reviewComment?: string;
};

const DocumentSchema = new Schema<DocumentSchemaType>(
  {
    clientId: { type: String, required: true },
    lawyerId: { type: Schema.Types.ObjectId, ref: "Lawyer" },
    images: { type: [String] },
    title: { type: String, required: true },
    content: { type: String },
    type: {
      type: String,
      enum: Object.values(DocumentMediaType),
      default: DocumentMediaType.TEXT,
    },
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.PENDING,
    },
    reviewComment: { type: String },
  },
  { timestamps: true }
);

export const Document: Model<DocumentSchemaType> =
  models["Document"] || model("Document", DocumentSchema);
