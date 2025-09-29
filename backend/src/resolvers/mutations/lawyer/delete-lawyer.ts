import { MutationResolvers } from "@/types/generated";
import { Lawyer } from "@/models";

export const deleteLawyer: MutationResolvers["deleteLawyer"] = async (
  _,
  { lawyerId }
) => {
  const deleted = await Lawyer.findOneAndDelete({ lawyerId });
  return !!deleted;
};
