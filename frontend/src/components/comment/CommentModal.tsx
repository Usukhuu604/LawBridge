"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT, DELETE_COMMENT } from "@/graphql/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Loader2, Send, Trash2, MessageCircle } from "lucide-react";
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

interface CommentModalProps {
  postId: string;
  comments: Comment[];
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

function CommentModal({
  postId,
  comments,
  onCommentAdded,
  onCommentDeleted,
}: CommentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const { user } = useUser();

  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setText("");
      onCommentAdded?.();
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });

  const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      onCommentDeleted?.();
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const handleSendComment = async () => {
    if (!text.trim() || creating) return;

    try {
      await createComment({
        variables: {
          input: {
            postId,
            content: text.trim(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{comments.length} сэтгэгдэл</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-[#091c3c]">
            Сэтгэгдлүүд ({comments.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Сэтгэгдэл байхгүй байна</p>
              <p className="text-xs text-gray-400 mt-1">
                Эхний сэтгэгдэл үлдээх үү?
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-100 border border-gray-200 rounded-xl p-4 "
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-row gap-5 min-w-0">
                      <div className="w-8 h-8 bg-[#003365] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getDisplayInitial(comment)}
                      </div>
                      <div className="flex flex-col gap-2 items-start space-x-2 mb-2">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {getDisplayName(comment)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2 justify-end items-end">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    {/* Delete button - only for comment author */}
                    {user?.id === comment.author && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deleting}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Comment Form */}
        <div className=" pt-4">
          <div className="space-y-3 border-0 rounded-xl focus:ring-0 focus:border-b-[#003365] bg-transparent">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Сэтгэгдэл бичих..."
              disabled={creating}
              className="resize-none border border-gray-200 rounded-xl"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSendComment}
                disabled={!text.trim() || creating}
                className="flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Илгээж байна...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Сэтгэгдэл үлдээх
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentModal;
