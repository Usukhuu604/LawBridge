import { Document } from "@/models";
import {
  QueryResolvers,
  DocumentMediaType,
  ReviewStatus,
} from "@/types/generated";

export const getDocumentsByStatus: QueryResolvers["getDocumentsByStatus"] =
  async (_, { status }) => {
    const docs = await Document.find({ status }).sort({ createdAt: -1 });

    return docs.map((doc) => ({
      _id: doc._id.toString(),
      clientId: doc.clientId,
      lawyerId: doc.lawyerId?.toString(),
      images: doc.images,
      title: doc.title,
      content: doc.content,
      type:
        doc.type !== undefined
          ? (doc.type as unknown as DocumentMediaType)
          : undefined,
      status:
        doc.status !== undefined
          ? (doc.status as unknown as ReviewStatus)
          : undefined,
      reviewComment: doc.reviewComment,
    }));
  };
