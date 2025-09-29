import { QueryResolvers } from "@/types/generated";
import { Lawyer } from "@/models";
import { GraphQLError } from "graphql";

export const getLawyersByStatus: QueryResolvers["getLawyersByStatus"] = async (
  _,
  { status },
) => {
  try {
    const lawyers = await Lawyer.find({ status })
      .populate("specialization")
      .populate("achievements")
      .lean();

    return lawyers as any;
  } catch (error) {
    console.error("Error in getLawyersByStatus resolver: ", error);
    throw new GraphQLError("Failed to fetch lawyers by status.", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
