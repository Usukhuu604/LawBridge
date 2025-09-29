import { LawyerRequest } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getPendingLawyerRequests: QueryResolvers["getPendingLawyerRequests"] =
  async () => {
    return await LawyerRequest.find({ status: "pending" }).sort({
      createdAt: -1,
    });
  };
