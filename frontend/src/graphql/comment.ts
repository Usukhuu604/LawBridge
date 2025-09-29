import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      _id
      content
      author
      createdAt
      post
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      _id
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      _id
      content
      updatedAt
    }
  }
`;

export const GET_COMMENTS_BY_POST = gql`
  query GetCommentsByPost($postId: ID!) {
    getCommentsByPost(postId: $postId) {
      _id
      content
      author
      createdAt
      updatedAt
    }
  }
`;
