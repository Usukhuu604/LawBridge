import { gql } from "graphql-tag";

export const commentTypeDefs = gql`
  scalar Date

  type CommentAuthorInfo {
    id: String!
    name: String!
    email: String
  }

  type Comment {
    _id: ID!
    post: ID!
    author: String!
    authorInfo: CommentAuthorInfo!
    content: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateCommentInput {
    postId: ID!
    content: String!
  }

  input UpdateCommentInput {
    commentId: ID!
    content: String!
  }

  input DeleteCommentInput {
    commentId: ID!
  }

  type Query {
    getCommentsByPost(postId: ID!): [Comment!]!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment!
    updateComment(input: UpdateCommentInput!): Comment!
    deleteComment(input: DeleteCommentInput!): Boolean!
  }
`;
