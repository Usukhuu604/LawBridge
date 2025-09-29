import { Document } from "@/models";
import { DocumentMediaType, MutationResolvers, ReviewStatus } from "@/types/generated";

export const reviewDocument: MutationResolvers["reviewDocument"] = async (
  _,
  { input },
  context
) => {
  // if (!context.userId) {
  //   throw new Error("Нэвтэрсэн өмгөөлөгч байхгүй байна.");
  // }

  const updated = await Document.findByIdAndUpdate(
    input.documentId,
    {
      lawyerId: context.userId, // ✅ context-оос авч байна
      status: input.status,
      reviewComment: input.reviewComment,
    },
    { new: true }
  );

  if (!updated) {
    throw new Error("Баримт олдсонгүй.");
  }

  return {
    _id: updated._id.toString(),
    clientId: updated.clientId,
    lawyerId: updated.lawyerId ? updated.lawyerId.toString() : undefined,
    images: updated.images,
    title: updated.title,
    content: updated.content,
    type: (updated.type ?? DocumentMediaType.Text) as DocumentMediaType,
    status: (updated.status ?? ReviewStatus.Pending) as ReviewStatus,
    reviewComment: updated.reviewComment,
  };
};
