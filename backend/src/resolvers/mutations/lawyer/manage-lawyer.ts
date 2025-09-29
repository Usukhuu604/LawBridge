import { MutationResolvers } from "@/types/generated";
import { Lawyer, VerifiedStatus } from "@/models"; // <
import { clerkClient } from "@clerk/clerk-sdk-node";
import { GraphQLError } from "graphql";

export const manageLawyerRequest: MutationResolvers["manageLawyerRequest"] =
  async (_, { input }, ) => {

    const { lawyerId, status } = input;

    // 2. Find the Lawyer Request
    const lawyerToManage = await Lawyer.findOne({ lawyerId });

    if (!lawyerToManage) {
      throw new GraphQLError("Lawyer request not found for the given ID.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    try {
      // 3. Main Logic Branching (using the string from input)
      if (status === "VERIFIED") {
        await clerkClient.users.updateUserMetadata(lawyerToManage.clerkUserId, {
          publicMetadata: {
            role: "lawyer",
          },
        });

        // FIX: Assign the value using the imported enum
        lawyerToManage.status = VerifiedStatus.VERIFIED;
        await lawyerToManage.save();

        return lawyerToManage.populate(["specialization", "achievements"]);
      } else if (status === "REJECTED") {
        await clerkClient.users.updateUserMetadata(lawyerToManage.clerkUserId, {
          publicMetadata: {
            role: "user",
            applicationStatus: "rejected",
          },
        });

        // FIX: Assign the value using the imported enum
        lawyerToManage.status = VerifiedStatus.REJECTED;
        await lawyerToManage.save();

        // As before, this returns the updated document. To delete, change the schema
        // and this return logic.
        return lawyerToManage.populate(["specialization", "achievements"]);
      } else {
        // This branch handles 'PENDING' or other invalid inputs
        throw new GraphQLError(
          "Invalid status provided. Must be VERIFIED or REJECTED.",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
    } catch (error) {
      console.error("Failed to manage lawyer request:", error);
      throw new GraphQLError(
        "An external or internal error occurred while managing the request.",
        {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        }
      );
    }
  };
