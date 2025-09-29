import { gql } from "@apollo/client";

export const GET_SPECIALIZATION_BY_LAWYER_ID = gql`
  query GetSpecializationsByLawyer($lawyerId: ID!) {
    getSpecializationsByLawyer(lawyerId: $lawyerId) {
      _id
      lawyerId
      specializationId
      categoryName
      subscription
      pricePerHour
    }
  }
`;
