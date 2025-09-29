import { appointmentTypeDefs } from "./appointment.schema";
import { availabilityTypeDefs } from "./availability.schema";
import { chatRoomSchema } from "./chat-room.schema";
import { messageTypeDefs } from "./message.schema";
import { documentTypeDefs } from "./document.schema";
import { lawyerTypeDefs } from "./lawyer.schema";
import { commentTypeDefs } from "./comment.schema";
import { notificationTypeDefs } from "./notification.schema";
import { reviewsTypeDefs } from "./review.schema";
import { specializationTypedefs } from "./specialization.schema";
import { postTypeDefs } from "./post.schema";
import { achievementTypeDefs } from "./achievements.schema";
import { lawyerSpecializationTypeDefs } from "./lawyer-specialization.schema";
import { chatHistoryTypeDefs } from "./chat-history.schema";

export const typeDefs = [
  achievementTypeDefs,
  lawyerTypeDefs,
  specializationTypedefs,
  commentTypeDefs,
  reviewsTypeDefs,
  notificationTypeDefs,
  postTypeDefs,
  appointmentTypeDefs,
  availabilityTypeDefs,
  chatRoomSchema,
  messageTypeDefs,
  documentTypeDefs,
  lawyerSpecializationTypeDefs,
  chatHistoryTypeDefs
];
