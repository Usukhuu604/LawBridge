import { gql } from "graphql-tag";

export const notificationTypeDefs = gql`
  scalar Date

  enum NotificationType {
    LAWYER_APPROVED
    APPOINTMENT_CREATED
    APPOINTMENT_REMINDER
    APPOINTMENT_STARTED
    REVIEW_RECEIVED
  }

  type Notification {
    id: ID!
    recipientId: ID!
    type: NotificationType!
    content: String!
    read: Boolean!
    createdAt: Date!
  }

  input CreateNotificationInput {
    recipientId: ID!
    type: NotificationType!
    content: String!
  }

  input NotificationsFilterInput {
    read: Boolean
    type: NotificationType
    limit: Int
    offset: Int
  }

  extend type Query {
    myNotifications(filter: NotificationsFilterInput): [Notification!]!
    notificationCount(unreadOnly: Boolean): Int!
  }

  extend type Mutation {
    createNotification(input: CreateNotificationInput!): Notification!
    markNotificationAsRead(notificationId: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
  }
`;
