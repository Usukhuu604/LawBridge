import { Document } from "@/models";
import {
  MutationResolvers,
  DocumentMediaType,
  ReviewStatus,
} from "@/types/generated";

export const createDocument: MutationResolvers["createDocument"] = async (
  _,
  { input },
  context
) => {
  try {
    // if (!context.userId) {
    //   throw new Error("Нэвтэрсэн хэрэглэгч байхгүй байна.");
    // }

    const created = await Document.create({
      images: input.images,
      title: input.title,
      content: input.content || "",
      type: input.type || DocumentMediaType.Text,
      status: ReviewStatus.Pending, 
      reviewComment: "",
    });

    return {
      _id: created._id.toString(),
      clientId: created.clientId,
      lawyerId: created.lawyerId?.toString(),
      images: created.images,
      title: created.title,
      content: created.content,
      type: (created.type ?? DocumentMediaType.Text) as DocumentMediaType, 
      status: (created.status ?? ReviewStatus.Pending) as ReviewStatus,
      reviewComment: created.reviewComment,
    };
  } catch (error) {
    console.error("createDocument error:", error);
    throw new Error("Баримт үүсгэхэд алдаа гарлаа.");
  }
};
