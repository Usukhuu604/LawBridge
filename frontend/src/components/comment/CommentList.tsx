"use client";

import { useMutation } from "@apollo/client";
import { DELETE_COMMENT } from "@/graphql/post";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Comment {
  _id: string;
  post: string;
  author: string;
  authorInfo: {
    id: string;
    name: string;
    email: string | null;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted?: () => void;
}

function CommentList({ comments, onCommentDeleted }: CommentListProps) {
  const { user } = useUser();
  const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      onCommentDeleted?.();
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Сэтгэгдлийг устгах уу?")) return;

    try {
      await deleteComment({
        variables: {
          input: {
            commentId,
          },
        },
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayName = (comment: Comment) => {
    // If we have an email, use the part before @
    if (comment.authorInfo.email) {
      return comment.authorInfo.email.split("@")[0];
    }

    // Use the name from authorInfo if available and it's not the same as author ID
    if (comment.authorInfo.name && comment.authorInfo.name !== comment.author) {
      return comment.authorInfo.name;
    }

    // Fallback to author ID
    return comment.author;
  };

  const getDisplayInitial = (comment: Comment) => {
    const displayName = getDisplayName(comment);
    return displayName.charAt(0).toUpperCase();
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Сэтгэгдэл байхгүй байна
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 bg-[#003365] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {getDisplayInitial(comment)}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {getDisplayName(comment)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {comment.content}
              </p>
            </div>

            {/* Only show delete button if user is the author */}
            {user?.id === comment.author && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteComment(comment._id)}
                disabled={deleting}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
