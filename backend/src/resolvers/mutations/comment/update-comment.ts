import { Comment } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const updateComment: MutationResolvers["updateComment"] = async (
  _,
  { input },
  context
) => {
  const author = context.userId;
  if (!author) throw new Error("Unauthorized");

  const comment = await Comment.findById(input.commentId);
  if (!comment) throw new Error("Comment not found");
  if (comment.author !== author) throw new Error("Not allowed to update");

  comment.content = input.content;
  await comment.save();

  return {
    _id: comment._id.toString(),
    post: comment.post.toString(),
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};
