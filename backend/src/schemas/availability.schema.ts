import { gql } from "graphql-tag";

export const availabilityTypeDefs = gql`
  type Availability {
    lawyerId: String!
    availableDays: [AvailableDay!]!
  }

  type AvailableDay {
    day: String!
    startTime: String!
    endTime: String!
    booked: Boolean!
  }

  type AvailabilitySchedule {
    _id: ID!
    lawyerId: String!
    availableDays: [AvailableDay!]!
  }

  input AvailableDayInput {
    day: String!
    startTime: String!
    endTime: String!
  }

  input SetAvailabilityInput {
    availableDays: [AvailableDayInput!]!
  }

  input UpdateAvailabilityDateInput {
    lawyerId: String!
    oldDay: String!
    oldStartTime: String!
    oldEndTime: String!
    newDay: String!
    newStartTime: String!
    newEndTime: String!
  }

  type Query {
    getAvailability(lawyerId: String, day: String): [Availability]
  }

  type Mutation {
    setAvailability(input: SetAvailabilityInput!): AvailabilitySchedule!
    updateAvailabilityDate(input: UpdateAvailabilityDateInput!): AvailabilitySchedule!
  }
`;
