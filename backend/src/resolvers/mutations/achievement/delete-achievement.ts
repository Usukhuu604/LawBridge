import { MutationResolvers } from "@/types/generated";
import { Achievement } from "@/models";

export const deleteAchievement: MutationResolvers["deleteAchievement"] = async (
  _,
  { id }
) => {
  const deleted = await Achievement.findByIdAndDelete(id);
  return !!deleted;
};
