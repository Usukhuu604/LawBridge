import { MutationResolvers } from "@/types/generated";
import { Specialization as SpecializationModel } from "@/models";

export const adminCreateSpecialization: MutationResolvers["adminCreateSpecialization"] =
  async (_, { input }: { input: { categoryName: string } }) => {
    try {
      const newSpecialization = await (SpecializationModel as any).create({
        categoryName: input.categoryName.trim(),
      });

      return newSpecialization;

    } catch (error: any) {
      console.error("❌ Error creating specialization:", error);

      if (error.code === 11000) {
        throw new Error(`A specialization with the name "${input.categoryName}" already exists.`);
      }

      throw new Error("Failed to create specialization due to a server error.");
    }
  };