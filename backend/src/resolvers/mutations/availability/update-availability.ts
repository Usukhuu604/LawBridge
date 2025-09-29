import { AvailabilitySchedule } from "@/models/availability.model";

export const updateAvailabilityDate = async (_parent: any, { input }: any) => {
  const {
    lawyerId,
    oldDay,
    oldStartTime,
    oldEndTime,
    newDay,
    newStartTime,
    newEndTime,
  } = input;

  // Find the schedule
  const schedule = await (AvailabilitySchedule as any).findOne({ lawyerId });
  if (!schedule) {
    throw new Error("AvailabilitySchedule not found for this lawyer.");
  }

  // Find the slot to update
  const slot = schedule.availableDays.find(
    (d: any) =>
      d.day === oldDay &&
      d.startTime === oldStartTime &&
      d.endTime === oldEndTime
  );
  if (!slot) {
    throw new Error("Slot not found.");
  }

  // Update the slot
  slot.day = newDay;
  slot.startTime = newStartTime;
  slot.endTime = newEndTime;

  await schedule.save();
  return schedule;
};

export * from "./set-availability";
