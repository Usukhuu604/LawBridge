import { MutationResolvers } from "@/types/generated";
import { Achievement } from "@/models";

export const updateAchievement: MutationResolvers["updateAchievement"] = async (
  _,
  { input }
) => {
  const { _id, ...fieldsToUpdate } = input;

  const updated = await Achievement.findByIdAndUpdate(_id, fieldsToUpdate, {
    new: true,
  });

  if (!updated) {
    throw new Error("Achievement not found");
  }

  return {
    _id: updated._id.toString(),
    title: updated.title,
    description: updated.description,
    threshold: updated.threshold,
    icon: updated.icon,
  };
};
