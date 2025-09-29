// resolvers/lawyerSpecialization/createSpecialization.ts
import { LawyerSpecialization } from "@/models";
import { MutationResolvers } from "@/types/generated";
import { GraphQLError } from "graphql";

export const createSpecialization: MutationResolvers["createSpecialization"] =
  async (_, { input }, context) => {
    try {
      const docs = input.specializations.map((s) => ({
        lawyerId: context.lawyerId,
        specializationId: s.specializationId,
        subscription: s.subscription,
        pricePerHour: s.subscription ? s.pricePerHour : 0, // If subscription is false, pricePerHour is 0
      }));

      // Insert and populate
      let created = await LawyerSpecialization.insertMany(docs);
      console.log({ created });
      let populated = (await LawyerSpecialization.populate(created as any, {
        path: "specializationId",
      })) as unknown as any[];

      return populated.map((spec) => {
        // Always return specializationId as a string
        const specId =
          spec.specializationId &&
          typeof spec.specializationId === "object" &&
          "_id" in (spec.specializationId as any)
            ? (spec.specializationId as any)._id.toString()
            : spec.specializationId
            ? spec.specializationId.toString()
            : "";

        // Get categoryName from populated specializationId
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
          categoryName: categoryName, // <-- This is only in the API response, not in the DB
          subscription: spec.subscription,
          pricePerHour: spec.subscription ? spec.pricePerHour : 0, // If subscription is false, pricePerHour is 0
        };
      });
    } catch (error) {
      console.error("❌ Error creating specializations:", error);
      throw new GraphQLError("Failed to create specializations");
    }
  };
