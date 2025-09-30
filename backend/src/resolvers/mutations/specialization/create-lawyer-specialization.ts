// resolvers/lawyerSpecialization/createSpecialization.ts
import { LawyerSpecialization } from "@/models";
import { MutationResolvers } from "@/types/generated";
import { GraphQLError } from "graphql";

export const createSpecialization: MutationResolvers["createSpecialization"] =
  async (_, { input }, context) => {
    try {
      // Validate input
      if (!input?.specializations || input.specializations.length === 0) {
        throw new GraphQLError("No specializations provided");
      }

      const docs = input.specializations.map((s) => {
        // Validate each specialization
        if (!s.lawyerId || !s.specializationId) {
          throw new GraphQLError(
            "Missing required fields: lawyerId or specializationId"
          );
        }

        return {
          lawyerId: s.lawyerId, // ✅ Use s.lawyerId from input
          specializationId: s.specializationId,
          subscription: s.subscription || false,
          pricePerHour: s.subscription ? s.pricePerHour || 0 : 0,
        };
      });

      console.log("Creating specializations with data:", docs);

      // Insert and populate
      let created = await LawyerSpecialization.insertMany(docs);
      console.log("Created specializations:", created);

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
          categoryName: categoryName,
          subscription: spec.subscription,
          pricePerHour: spec.subscription ? spec.pricePerHour : 0,
        };
      });
    } catch (error) {
      console.error("❌ Error creating specializations:", error);
      throw new GraphQLError(
        `Failed to create specializations: ${error.message}`
      );
    }
  };
