import { gql } from "graphql-tag";

export const lawyerTypeDefs = gql`
  scalar Date

  enum LawyerRequestStatus {
    PENDING
    VERIFIED
    REJECTED
  }

  # type Specialization {
  #   _id: ID!
  #   categoryName: String!
  # }

  type Achievement {
    _id: ID!
    title: String!
    description: String
  }

  type Lawyer {
    _id: ID!
    lawyerId: ID!
    clerkUserId: String
    clientId: String
    firstName: String!
    lastName: String!
    email: String!
    licenseNumber: String!
    bio: String
    university: String
    specialization: [Specialization!]! # <<== Шинэ бүтэц
    achievements: [Achievement!]!
    status: LawyerRequestStatus
    document: String
    rating: Int
    profilePicture: String!
    createdAt: Date!
    updatedAt: Date
  }

  input LawyerSpecializationInput {
    categoryId: ID! # Specialization ID
    pricePerHour: Int
    subscription: Boolean
  }

  input CreateLawyerInput {
    lawyerId: ID!
    firstName: String!
    lastName: String!
    email: String!
    licenseNumber: String!
    bio: String
    university: String
    # specialization: [LawyerSpecializationInput!]!  # <<== Шинэ input
    achievements: [ID!]
    document: String
    rating: Int
    profilePicture: String!
  }

  input UpdateLawyerInput {
    firstName: String
    lastName: String
    email: String
    licenseNumber: String
    bio: String
    university: String
    specialization: [LawyerSpecializationInput!]
    achievements: [ID!]
    document: String
    rating: Int
    profilePicture: String
  }

  input ManageLawyerRequestInput {
    lawyerId: ID!
    status: LawyerRequestStatus!
  }

  type Query {
    getLawyers: [Lawyer!]!
    getLawyerById(lawyerId: ID!): Lawyer
    getLawyersBySpecialization(specializationId: ID!): [Lawyer!]!
    getLawyersByAchievement(achievementId: ID!): [Lawyer!]!
    getLawyersByStatus(status: LawyerRequestStatus!): [Lawyer!]!
  }

  type Mutation {
    createLawyer(input: CreateLawyerInput!): Lawyer!
    updateLawyer(lawyerId: ID!, input: UpdateLawyerInput!): Lawyer!
    deleteLawyer(lawyerId: ID!): Boolean!
    manageLawyerRequest(input: ManageLawyerRequestInput!): Lawyer!
  }
`;
