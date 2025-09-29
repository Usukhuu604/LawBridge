import { Review } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getReviewsByLawyer: QueryResolvers["getReviewsByLawyer"] = async (
  _:unknown,
  { lawyerId }
) => {
  const reviews = await Review.find({ lawyerId }).sort({ createdAt: -1 });

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
