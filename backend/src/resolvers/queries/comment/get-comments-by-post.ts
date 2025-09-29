import { Comment } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getCommentsByPost: QueryResolvers["getCommentsByPost"] = async (
  _,
  { postId },
  context
) => {
  const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });

  return comments.map((comment) => ({
    _id: comment._id.toString(),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    post: comment.post.toString(),
    content: comment.content,
    author: comment.author,
  }));
};
