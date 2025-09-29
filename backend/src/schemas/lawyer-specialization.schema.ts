// typeDefs/lawyerSpecialization.ts
import { gql } from "graphql-tag";

export const lawyerSpecializationTypeDefs = gql`
  type Specialization {
    _id: ID!
    lawyerId: ID!
    specializationId: ID!
    categoryName: String
    subscription: Boolean!
    pricePerHour: Int
  }

  input CreateSpecializationInput {
    lawyerId: ID
    specializationId: ID!
    subscription: Boolean!
    pricePerHour: Int!
  }

  input SpecializationInput {
    specializations: [CreateSpecializationInput!]!
  }

  input UpdateSpecializationInput {
    subscription: Boolean!
    pricePerHour: Int
  }

  type Query {
    getSpecializationsByLawyer(lawyerId: ID!): [Specialization!]!
  }

  type Mutation {
    createSpecialization(input: SpecializationInput): [Specialization]!
    deleteSpecialization(specializationId: ID!): Boolean!
    updateSpecialization(
      specializationId: ID!
      input: UpdateSpecializationInput!
    ): Specialization!
  }
`;
