import { Review } from "@/models";
import { MutationResolvers } from "@/types/generated";
import { Types } from "mongoose";

export const createReview: MutationResolvers["createReview"] = async (
  _: unknown,
  { clientId, lawyerId, input }, // Accept parameters directly
  context
) => {
  if (!context.userId) {
    throw new Error("User must be authenticated to create a review");
  }

  if (!clientId) throw new Error("Client ID is required");
  if (!lawyerId) throw new Error("Lawyer ID is required");

  // Validate that the clientId matches the authenticated user
  if (clientId !== context.userId) {
    throw new Error("You can only create reviews for yourself");
  }
  const newReview = await Review.create({
    clientId,
    lawyerId: new Types.ObjectId(lawyerId),
    rating: input.rating,
    comment: input.comment,
  });
  return {
    id: newReview._id.toString(),
    clientId: newReview.clientId,
    lawyerId: newReview.lawyerId.toString(),
    rating: newReview.rating,
    comment: newReview.comment,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt,
  };
};
