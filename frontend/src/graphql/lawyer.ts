import { gql } from "@apollo/client";

export const CREATE_LAWYER_MUTATION = gql`
  mutation CreateLawyer($input: CreateLawyerInput!) {
    createLawyer(input: $input) {
      bio
      document
      firstName
      lastName
      licenseNumber
      profilePicture
      university
    }
  }
`;

export const GET_ALL_LAWYERS_QUERY = gql`
  query Query {
    getLawyers {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      achievements {
        _id
        title
        description
        threshold
        icon
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

export const GET_LAWYER_BY_LAWYERID_QUERY = gql`
  query GetLawyerById($lawyerId: ID!) {
    getLawyerById(lawyerId: $lawyerId) {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      achievements {
        _id
        title
        description
        threshold
        icon
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LAWYER_MUTATION = gql`
  mutation Mutation($updateLawyerLawyerId2: ID!, $input: UpdateLawyerInput!) {
    updateLawyer(lawyerId: $updateLawyerLawyerId2, input: $input) {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      achievements {
        _id
        title
        description
        threshold
        icon
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_LAWYERS = gql`
  query GetLawyers {
    getLawyers {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      specialization {
        _id
        lawyerId
        specializationId
        categoryName
        subscription
        pricePerHour
      }
      achievements {
        _id
        title
        description
        threshold
        icon
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

export const GET_LAWYERS_BY_IDS = gql`
  query GetLawyersByIds($ids: [ID!]!) {
    getLawyersByIds(ids: $ids) {
      lawyerId
      firstName
      lastName
      profilePicture
    }
  }
`;
