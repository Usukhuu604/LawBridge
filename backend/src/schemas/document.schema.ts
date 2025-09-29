import { gql } from "graphql-tag";

export const documentTypeDefs = gql`
  enum DocumentMediaType {
    TEXT
    IMAGE
    FILE
  }

  enum ReviewStatus {
    PENDING
    REVIEWED
    REJECTED
  }

  type Document {
    _id: ID!
    clientId: String!
    lawyerId: ID
    images: [String!]!
    title: String!
    content: String
    type: DocumentMediaType
    status: ReviewStatus
    reviewComment: String
  }

  input CreateDocumentInput {
    images: [String!]!
    title: String!
    content: String
    type: MediaType
  }

  input ReviewDocumentInput {
    documentId: ID!
    status: ReviewStatus!
    reviewComment: String
  }

  type Query {
    getDocumentsByUser(userId: String!): [Document!]!
    getDocumentsByStatus(status: ReviewStatus!): [Document!]!
  }

  type Mutation {
    createDocument(input: CreateDocumentInput!): Document!
    reviewDocument(input: ReviewDocumentInput!): Document!
  }
`;
