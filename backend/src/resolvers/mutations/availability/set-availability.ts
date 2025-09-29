import { MutationResolvers } from "@/types/generated";
import { AvailabilitySchedule } from "@/models";

export const setAvailability: MutationResolvers["setAvailability"] = async (
  _,
  { input },
  context
) => {
  const lawyerId = context.lawyerId;
  if (!lawyerId) {
    throw new Error("Invalid lawyerId");
  }

  // Remove any previous schedule for this lawyer (optional, for replace behavior)
  await AvailabilitySchedule.deleteMany({ lawyerId });

  // Save new schedule
  const created = await (AvailabilitySchedule as any).create({
    lawyerId,
    availableDays: input.availableDays, // expects [{ day, startTime, endTime }, ...]
  });

  return {
    _id: created._id.toString(),
    lawyerId: created.lawyerId,
    availableDays: created.availableDays,
  };
};
