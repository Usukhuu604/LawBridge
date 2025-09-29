import { gql } from "graphql-tag";

export const reviewsTypeDefs = gql`
  scalar Date

  type Review {
    id: ID!
    clientId: ID!
    lawyerId: ID!
    rating: Int!
    comment: String
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateReviewInput {
    rating: Int!
    comment: String
  }

  input UpdateReviewInput {
    rating: Int
    comment: String
  }

  type Query {
    getReviewsByLawyer(lawyerId: ID!): [Review!]!
    getReviewsByUser(clientId: ID!): [Review!]!
  }

  type Mutation {
    createReview(
      clientId: ID!
      lawyerId: ID!
      input: CreateReviewInput!
    ): Review!
    updateReview(reviewId: ID!, input: UpdateReviewInput!): Review!
    deleteReview(reviewId: ID!): Boolean!
  }
`;
