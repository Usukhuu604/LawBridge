import { gql } from "graphql-tag";

export const achievementTypeDefs = gql`
  type Achievement {
    _id: ID!
    title: String!
    description: String!
    threshold: Int!
    icon: String
  }

  input CreateAchievementInput {
    title: String!
    description: String!
    threshold: Int!
    icon: String
  }

  input UpdateAchievementInput {
    _id: ID!
    title: String
    description: String
    threshold: Int
    icon: String
  }

  type Query {
    getAchievements(lawyerId: ID!): [Achievement]
  }

  type Mutation {
    createAchievement(input: CreateAchievementInput!): Achievement!
    updateAchievement(input: UpdateAchievementInput!): Achievement!
    deleteAchievement(id: ID!): Boolean!
  }
`;
