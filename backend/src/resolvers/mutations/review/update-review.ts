import { Review } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const updateReview: MutationResolvers["updateReview"] = async (
  _: unknown,
  { reviewId, input },
  context
) => {
  const clientId = context.clientId;
  if (!clientId) throw new Error("Unauthorized: Client not authenticated");

  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");
  if (review.clientId !== clientId) throw new Error("Not authorized to update this review");

  if (input.rating !== undefined) review.rating = input.rating;
  if (input.comment !== undefined) review.comment = input.comment;

  await review.save();

  return {
    id: review._id.toString(),
    clientId: review.clientId,
    lawyerId: review.lawyerId.toString(),
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
};
