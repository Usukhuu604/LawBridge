import { Review } from "@/models";
import { QueryResolvers } from "@/types/generated";
export const getReviewsByUser: QueryResolvers["getReviewsByUser"] = async (
  _:unknown,
  { clientId }
) => {
  const reviews = await Review.find({ clientId }).sort({ createdAt: -1 });

  return reviews.map((review) => ({
    id: review._id.toString(),
    clientId: review.clientId,
    lawyerId: review.lawyerId.toString(),
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }));
};
