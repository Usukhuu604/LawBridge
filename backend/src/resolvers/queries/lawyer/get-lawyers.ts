import { QueryResolvers } from "@/types/generated";
import { Lawyer } from "@/models";

export const getLawyers: QueryResolvers["getLawyers"] = async () => {
  const lawyers = await Lawyer.find()
    .populate("specialization")
    .populate("achievements")
    .lean();

  return lawyers.map((lawyer) => ({
    ...lawyer,
    id: lawyer._id.toString(),
  })) as any;
};
