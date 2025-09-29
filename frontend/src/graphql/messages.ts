import { gql } from "@apollo/client";

// ✅ Create Message Mutation
export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage(
    $chatRoomId: String!
    $userId: String!
    $type: String!
    $content: String!
  ) {
    createMessage(
      chatRoomId: $chatRoomId
      userId: $userId
      type: $type
      content: $content
    ) {
      id
      chatRoomId
      userId
      type
      content
      createdAt
      sender {
        id
        name
        imageUrl
      }
    }
  }
`;

// ✅ Get Messages Query
export const GET_MESSAGES_QUERY = gql`
  query GetMessages($chatRoomId: String!) {
    messages(chatRoomId: $chatRoomId) {
      id
      chatRoomId
      userId
      type
      content
      createdAt
      sender {
        id
        name
        imageUrl
      }
    }
  }
`;

// ✅ Get Chat Rooms Query
export const GET_CHAT_ROOMS_QUERY = gql`
  query GetChatRooms {
    chatRooms {
      id
      name
      description
      createdAt
      participants {
        id
        name
        imageUrl
      }
      lastMessage {
        id
        content
        createdAt
        sender {
          id
          name
        }
      }
    }
  }
`;
