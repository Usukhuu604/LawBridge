import {gql} from 'graphql-tag'

export const chatRoomSchema = gql`
  enum AllowedMediaEnum {
    TEXT
    AUDIO
    VIDEO
    IMAGE
  }

  type ChatRoom {
    _id: String!
    participants: [String!]!
    appointmentId: String!
    allowedMedia: AllowedMediaEnum
    lastMessage: Message
  }

  input CreateChatRoomInput {
    participants: [String!]!
    appointmentId: String!
    allowedMedia: AllowedMediaEnum
  }

  input UpdateChatRoomInput {
    _id: String!
    participants: [String!]
    appointmentId: String
    allowedMedia: AllowedMediaEnum
  }

  type Query {
    getChatRoomById(_id: String!): ChatRoom
    getChatRoomsByAppointment(appointmentId: String!): [ChatRoom!]!
    getChatRoomByUser(userId: String!): [ChatRoom!]!
  }

  type Mutation {
    createChatRoomAfterAppointment(input: CreateChatRoomInput!): ChatRoom!
    updateChatRoom(input: UpdateChatRoomInput!): ChatRoom!
  }
`;