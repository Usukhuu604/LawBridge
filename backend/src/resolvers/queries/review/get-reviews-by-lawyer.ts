import { Review } from "@/models";
import { QueryResolvers } from "@/types/generated";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export const getReviewsByLawyer: QueryResolvers["getReviewsByLawyer"] = async (
  _: unknown,
  { lawyerId }
) => {
  const reviews = await Review.find({ lawyerId }).sort({ createdAt: -1 });

  return Promise.all(
    reviews.map(async (review) => {
      let clientInfo = {
        id: review.clientId,
        name: review.clientId,
        email: null,
      };

      try {
        // Try to fetch user details from Clerk
        const clerkUser = await clerkClient.users.getUser(review.clientId);
        clientInfo = {
          id: clerkUser.id,
          name:
            clerkUser.fullName ||
            clerkUser.emailAddresses[0]?.emailAddress ||
            review.clientId,
          email: clerkUser.emailAddresses[0]?.emailAddress || null,
        };
      } catch (error) {
        console.error(
          `Failed to fetch user details for client ${review.clientId}:`,
          error
        );
        // Fallback to original client ID
      }

      return {
        id: review._id.toString(),
        clientId: review.clientId,
        clientInfo,
        lawyerId: review.lawyerId.toString(),
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    })
  );
};
