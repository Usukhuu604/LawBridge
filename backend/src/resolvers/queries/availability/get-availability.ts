import { QueryResolvers } from "@/types/generated";
import { AvailabilitySchedule } from "@/models";

export const getAvailability: QueryResolvers["getAvailability"] = async (
  _,
  { lawyerId }
) => {
  const schedule = await (AvailabilitySchedule as any).findOne({ lawyerId });
  if (!schedule) {
    return [];
  }
  return [
    {
      lawyerId: schedule.lawyerId,
      availableDays: schedule.availableDays.map((dayObj: any) => ({
        day: dayObj.day,
        startTime: dayObj.startTime,
        endTime: dayObj.endTime,
        booked: dayObj.booked,
      })),
    },
  ];
};