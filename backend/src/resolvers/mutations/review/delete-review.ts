import { Review } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const deleteReview: MutationResolvers["deleteReview"] = async (
  _: unknown,
  { reviewId },
  context
) => {
  const clientId = context.clientId;
  if (!clientId) throw new Error("Unauthorized: Client not authenticated");

  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");
  if (review.clientId !== clientId) throw new Error("Not authorized to delete this review");

  await review.deleteOne();
  return true;
};
