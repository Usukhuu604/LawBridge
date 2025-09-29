import { MutationResolvers } from "@/types/generated";
import { Lawyer } from "@/models";

export const updateLawyer: MutationResolvers["updateLawyer"] = async (
  _,
  { lawyerId, input },
  context
) => {
  const updatedLawyer = await Lawyer.findOneAndUpdate(
    { lawyerId },
    { $set: input },
    { new: true }
  )
    .populate("specialization")
    .populate("achievements")
    .lean();

  if (!updatedLawyer) {
    throw new Error("Lawyer not found");
  }

  return {
    ...updatedLawyer,
    id: updatedLawyer._id.toString(),
    specialization: updatedLawyer.specialization.map((s: any) => ({
      id: s._id.toString(),
      categoryName: s.categoryName,
      subscription: s.subscription,
      pricePerHour: s.pricePerHour,
    })),
    achievements: updatedLawyer.achievements.map((a: any) => ({
      _id: a._id.toString(),
      title: a.title,
      description: a.description,
      threshold: a.threshold,
      icon: a.icon,
    })),
  };
};
