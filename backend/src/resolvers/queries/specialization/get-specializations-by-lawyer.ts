// resolvers/lawyerSpecialization/getSpecializationsByLawyer.ts
import { LawyerSpecialization } from "@/models";
import { QueryResolvers } from "@/types/generated";
import { GraphQLError } from "graphql";

export const getSpecializationsByLawyer: QueryResolvers["getSpecializationsByLawyer"] =
  async (_, { lawyerId }) => {
    try {
      const specializations = await LawyerSpecialization.find({
        lawyerId,
      }).populate("specializationId");

      return specializations.map((spec) => {
        const specId =
          spec.specializationId &&
          typeof spec.specializationId === "object" &&
          "_id" in (spec.specializationId as any)
            ? (spec.specializationId as any)._id.toString()
            : spec.specializationId
              ? spec.specializationId.toString()
              : "";

        const categoryName =
          spec.specializationId &&
          typeof spec.specializationId === "object" &&
          "categoryName" in (spec.specializationId as any)
            ? (spec.specializationId as any).categoryName
            : null;

        return {
          _id: spec._id.toString(),
          lawyerId: spec.lawyerId.toString(),
          specializationId: specId,
          categoryName: categoryName,
          subscription: spec.subscription,
          pricePerHour: spec.pricePerHour,
        };
      });
    } catch (error) {
      throw new GraphQLError("Failed to fetch specializations");
    }
  };
