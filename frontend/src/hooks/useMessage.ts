import { useQuery } from '@apollo/client';
import { GET_MESSAGES_QUERY } from '@/graphql/messages';

interface Message {
  id: string;
  chatRoomId: string;
  userId: string;
  type: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

interface GetMessagesResponse {
  messages: Message[];
}

interface GetMessagesVariables {
  chatRoomId: string;
}

export const useMessages = (chatRoomId: string) => {
  const { loading, error, data, refetch } = useQuery<
    GetMessagesResponse,
    GetMessagesVariables
  >(GET_MESSAGES_QUERY, {
    variables: { chatRoomId },
    skip: !chatRoomId,
  });

  return { messages: data?.messages || [], loading, error, refetch };
};