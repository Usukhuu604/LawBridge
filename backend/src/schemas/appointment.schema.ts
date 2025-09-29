import { gql } from "graphql-tag";

export const appointmentTypeDefs = gql`
  type Appointment {
    id: ID!
    clientId: String!
    lawyerId: String!
    status: AppointmentStatus!
    chatRoomId: String
    price: Int
    subscription: Boolean!
    specializationId: ID!
    slot: AvailableDay!
    specialization: Specialization
    createdAt: String
    endedAt: String
    notes: String
  }

  enum AppointmentStatus {
    PENDING
    CONFIRMED
    COMPLETED
    CANCELLED
  }

  type AvailableDay {
    day: String!
    startTime: String!
    endTime: String!
    booked: Boolean!
  }

  input AvailableDayInput {
    day: String!
    startTime: String!
    endTime: String!
  }

  input CreateAppointmentInput {
    clientId: String!
    lawyerId: String!
    specializationId: ID!
    slot: AvailableDayInput!
    notes: String
  }

  type Query {
    getAppointments: [Appointment]
    getAppointmentById(id: String!): Appointment
    getAppointmentsByLawyer(lawyerId: String!): [Appointment]
    getAppointmentsByUser(clientId: String!): [Appointment]
  }

  type Mutation {
    createAppointment(input: CreateAppointmentInput!): Appointment
    createChatRoom(appointmentId: String!): String
  }
`;
