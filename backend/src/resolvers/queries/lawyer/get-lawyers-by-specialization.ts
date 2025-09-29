import { QueryResolvers } from "@/types/generated";
import { Lawyer as LawyerModel } from "@/models";
import { Types } from "mongoose";

export const getLawyersBySpecialization: QueryResolvers["getLawyersBySpecialization"] =
  async (_, { specializationId }) => {
    const lawyers = await LawyerModel.find({
      specialization: new Types.ObjectId(specializationId),
    })
      .populate("specialization")
      .populate("achievements")
      .lean();

    return lawyers.map((lawyer) => ({
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
    }));
  };
