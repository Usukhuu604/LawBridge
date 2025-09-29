import { QueryResolvers } from "@/types/generated";
import { Lawyer as LawyerModel } from "@/models";

export const getLawyerById: QueryResolvers["getLawyerById"] = async (
  _,
  { lawyerId }
) => {
  // Use the Clerk user ID, not MongoDB _id
  const lawyer = await LawyerModel.findOne({ lawyerId })
    .populate("specialization")
    .populate("achievements")
    .lean();

  if (!lawyer) {
    throw new Error("Lawyer not found");
  }
  return {
    id: lawyer._id.toString(),
    _id: lawyer._id.toString(),
    lawyerId: lawyer.lawyerId,
    clerkUserId: lawyer.clerkUserId,
    clientId: lawyer.clientId,
    firstName: lawyer.firstName,
    lastName: lawyer.lastName,
    email: lawyer.email,
    licenseNumber: lawyer.licenseNumber,
    bio: lawyer.bio,
    university: lawyer.university,
    profilePicture: lawyer.profilePicture,
    specialization: lawyer.specialization.map((s: any) => ({
      ...s,
      id: s._id.toString(),
    })),
    achievements: lawyer.achievements.map((a: any) => ({
      ...a,
      id: a._id.toString(),
    })),
    createdAt: lawyer.createdAt?.toISOString?.() ?? lawyer.createdAt,
    updatedAt: lawyer.updatedAt?.toISOString?.() ?? lawyer.updatedAt,
    // ...add any other required fields from your GraphQL type
  };
};
