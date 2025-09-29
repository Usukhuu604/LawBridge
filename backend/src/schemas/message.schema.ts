import { gql } from "graphql-tag";

export const messageTypeDefs = gql`
  enum MediaType {
    TEXT
    IMAGE
    VIDEO
    AUDIO
  }

  type Message {
    chatRoomId: ID!
    ChatRoomsMessages: [ChatRoomsMessages!]!
  }

  type ChatRoomsMessages {
    _id: ID!
    userId: String!
    type: MediaType!
    content: String!
    createdAt: String!
  }

  type Query {
    getMessages(chatRoomId: ID!): [Message!]!
  }

  type Mutation {
    createMessage(
      chatRoomId: ID!
      userId: String!
      type: MediaType!
      content: String
    ): Message
  }
`;
