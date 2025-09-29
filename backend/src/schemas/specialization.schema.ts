import { gql } from "graphql-tag";

export const specializationTypedefs = gql`
  type AdminSpecialization {
    id: ID!
    categoryName: String!
  }

  input AdminCreateSpecializationInput {
    categoryName: String!
  }

  type Query {
    getAdminSpecializations: [AdminSpecialization!]!
  }

  type Mutation {
    adminCreateSpecialization(
      input: AdminCreateSpecializationInput!
    ): AdminSpecialization!
  }
`;
