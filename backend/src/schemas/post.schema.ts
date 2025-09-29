import { gql } from "graphql-tag";

export const postTypeDefs = gql`
  scalar Date

  enum MediaType {
    TEXT
    IMAGE
    VIDEO
    AUDIO
    FILE # General file type
  }

  # This object type describes the *content* of the post
  type PostContent {
    text: String
    image: String
    video: String
    audio: String
  }

  # This input type is used for creating the content
  input PostContentInput {
    text: String
    image: String
    video: String
    audio: String
  }

  type Post {
    _id: ID!
    id: ID! # Virtual field
    lawyerId: ID!
    title: String!
    content: PostContent! # <-- FIX: This now correctly uses the object type
    specialization: [AdminSpecialization!]!
    type: MediaType! # <-- CORRECT: This remains an enum
    author: PostAuthor
    comments: [Comment!]!
    createdAt: Date!
    updatedAt: Date
  }

  type PostAuthor {
    id: ID!
    firstName: String
    lastName: String
    name: String
    username: String
    email: String
    profilePicture: String
  }

  input MediaInput {
    text: String
    image: String
    video: String
    audio: String
  }

  input CreatePostInput {
    title: String!
    content: PostContentInput!
    specialization: [ID!]!
  }

  input UpdatePostInput {
    title: String
    content: PostContentInput
    specialization: [ID!]
  }

  type Query {
    getPosts: [Post!]!
    getPostsByLawyer(lawyerId: ID!): [Post!]!
    getPostById(postId: ID!): Post
    getPostsBySpecializationId(specializationId: ID!): [Post!]!
    searchPosts(query: String!): [Post!]!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(postId: ID!, input: UpdatePostInput!): Post!
    deletePost(postId: ID!): Boolean!
  }
`;
