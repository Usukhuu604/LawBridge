import { useMutation } from "@apollo/client";
import { DELETE_ALL_MESSAGES_MUTATION } from "@/graphql/messages";

export const useDeleteAllMessages = () => {
  const [deleteAllMessages, { loading, error }] = useMutation(
    DELETE_ALL_MESSAGES_MUTATION,
    {
      onCompleted: (data) => {
        console.log("✅ All messages deleted successfully:", data);
      },
      onError: (error) => {
        console.error("❌ Error deleting all messages:", error);
      },
    }
  );

  const handleDeleteAllMessages = async (chatRoomId: string) => {
    try {
      const result = await deleteAllMessages({
        variables: { chatRoomId },
        refetchQueries: ["GetMessages"], // Refetch messages after deletion
      });
      return result.data?.deleteAllMessages;
    } catch (error) {
      console.error("Failed to delete all messages:", error);
      throw error;
    }
  };

  return {
    deleteAllMessages: handleDeleteAllMessages,
    loading,
    error,
  };
};
