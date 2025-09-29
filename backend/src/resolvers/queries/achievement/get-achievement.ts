import { QueryResolvers } from "@/types/generated";

export const getAchievements: QueryResolvers["getAchievements"] = async (
  parent: unknown,
  { lawyerId },
  context
) => {
  const lawyer = await context.db.collection("Lawyer").findOne({ lawyerId });

  if (!lawyer) {
    return [];
  }

  const chatroomCount = Array.isArray(lawyer.chatrooms)
    ? lawyer.chatrooms.length
    : 0;
  const achievements = await context.db
    .collection("Achievement")
    .find({ threshold: { $lte: chatroomCount } })
    .sort({ threshold: 1 })
    .toArray();

  interface Achievement {
    _id: { toString(): string };
    description: string;
    threshold: number;
    title: string;
    userId: string;
    icon: string;
  }

  interface AchievementResult {
    _id: string;
    description: string;
    threshold: number;
    title: string;
    userId: string;
    icon: string;
  }

  return achievements.map(
    (achievement: Achievement): AchievementResult => ({
      _id: achievement._id.toString(),
      description: achievement.description,
      threshold: achievement.threshold,
      title: achievement.title,
      userId: achievement.userId,
      icon: achievement.icon,
    })
  );
};
