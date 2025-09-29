import { gql } from "@apollo/client";

export const GET_LAWYER_POSTS_BY_ID = gql`
  query GetLawyerPosts($lawyerId: ID!) {
    getPostsByLawyer(lawyerId: $lawyerId) {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      author {
        id
        firstName
        lastName
        name
        username
        email
        profilePicture
      }
      comments {
        _id
        post
        author
        authorInfo {
          id
          name
          email
        }
        content
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      author {
        id
        firstName
        lastName
        name
        username
        email
        profilePicture
      }
      comments {
        _id
        post
        author
        authorInfo {
          id
          name
          email
        }
        content
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $input: UpdatePostInput!) {
    updatePost(postId: $postId, input: $input) {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      _id
      post
      author
      content
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      _id
      post
      author
      content
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input)
  }
`;

export const GET_ALL_POSTS_FROM_LAWYERS = gql`
  query GetPosts {
    getPosts {
      _id
      id
      lawyerId
      title
      content {
        text
        image
        video
        audio
      }
      specialization {
        id
        categoryName
      }
      type
      createdAt
      updatedAt
    }
  }
`;
