import { gql } from "graphql-tag";

export const chatHistoryTypeDefs = gql`
  scalar JSON

  type ChatHistory {
    _id: ID!
    userId: String!
    sessionId: String!
    userMessage: String!
    botResponse: JSON!
    createdAt: String!
  }

  input ChatHistoryInput {
    userId: String
    sessionId: String
    userMessage: String!
    botResponse: JSON
  }

  type Mutation {
    saveChatHistory(input: ChatHistoryInput!): ChatHistory!
    clearChatHistory(userId: String!): Boolean!
  }

  type Query {
    getChatHistoryByUser(userId: String!): [ChatHistory!]!
  }
`;
