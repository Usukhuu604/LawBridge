import { Specialization } from "@/models";
import { QueryResolvers } from "@/types/generated";
import { GraphQLError } from "graphql";

export const getAdminSpecializations: QueryResolvers["getAdminSpecializations"] =
  async () => {
    try {
      const specializations = await (Specialization as any).find();

      return specializations.map((s) => ({
        id: s._id.toString(),
        categoryName: s.categoryName,
      }));
    } catch (error: any) {
      throw new GraphQLError(`Failed to fetch specializations: ${error.message}`);
    }
  };
