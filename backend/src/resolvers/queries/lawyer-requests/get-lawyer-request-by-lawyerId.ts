import { QueryResolvers } from "@/types/generated";
import { LawyerRequest } from "@/models";

export const getLawyerRequestByLawyerId: QueryResolvers["getLawyerRequestByLawyerId"] =
  async (_, { lawyerId }) => {
    const request = await LawyerRequest.findOne({ lawyerId });

    if (!request) throw new Error("Request not found");

    return {
      id: request._id.toString(),
      lawyerId: request.lawyerId,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      licenseNumber: request.licenseNumber,
      university: request.university,
      bio: request.bio,
      profilePicture: request.profilePicture,
      documents: request.documents ?? null,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      specializations: request.specializations.map((spec: any) => ({
        categoryName: spec.categoryName,
        subscription: spec.subscription,
        pricePerHour: spec.pricePerHour ?? null,
      })),
    };
  };
