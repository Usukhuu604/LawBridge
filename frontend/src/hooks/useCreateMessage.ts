import { useMutation } from "@apollo/client";
import { CREATE_MESSAGE_MUTATION } from "@/graphql/messages";

interface CreateMessageVariables {
  chatRoomId: string;
  userId: string;
  type: string;
  content: string;
}

interface CreateMessageResponse {
  createMessage: {
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
  };
}

export const useCreateMessage = () => {
  const [createMessageMutation, { loading, error, data }] = useMutation<
    CreateMessageResponse,
    CreateMessageVariables
  >(CREATE_MESSAGE_MUTATION, {
    onError: (error) => {
      console.error("❌ GraphQL mutation error:", error);
    },
    onCompleted: (data) => {
      console.log("✅ GraphQL mutation completed:", data);
    },
  });

  const createMessage = async (variables: {
    variables: CreateMessageVariables;
  }) => {
    try {
      const result = await createMessageMutation(variables);
      return result;
    } catch (err) {
      console.error("❌ Error in createMessage:", err);
      throw err;
    }
  };

  return {
    createMessage,
    loading,
    error,
    data,
  };
};
