import { MutationResolvers } from "@/types/generated";
import { Achievement } from "@/models";

export const createAchievement: MutationResolvers["createAchievement"] = async (
  _,
  { input }
) => {
  const created = await Achievement.create({
    title: input.title,
    description: input.description,
    threshold: input.threshold,
    icon: input.icon,
  });

  return {
    _id: created._id.toString(),
    ...input,
  };
};
