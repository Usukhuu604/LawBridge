// resolvers/lawyerSpecialization/updateSpecialization.ts
import { LawyerSpecialization } from "@/models";
import { MutationResolvers } from "@/types/generated";
import { GraphQLError } from "graphql";

export const updateSpecialization: MutationResolvers["updateSpecialization"] =
  async (_, { specializationId, input }) => {
    try {
      const updated = await LawyerSpecialization.findByIdAndUpdate(
        specializationId,
        {
          subscription: input.subscription,
          pricePerHour: input.pricePerHour,
        },
        { new: true }
      );

      if (!updated) {
        throw new GraphQLError("Specialization not found");
      }

      return {
        _id: updated._id.toString(),
        lawyerId: updated.lawyerId.toString(),
        specializationId: updated.specializationId.toString(),
        subscription: updated.subscription,
        pricePerHour: updated.pricePerHour,
      };
    } catch (error) {
      throw new GraphQLError("Failed to update specialization");
    }
  };
