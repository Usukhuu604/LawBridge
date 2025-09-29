import { Comment, Post } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const createComment: MutationResolvers["createComment"] = async (
  _,
  { input },
  context
) => {
  const author = context.userId;
  if (!author) throw new Error("Unauthorized");

  // Create the comment
  const newComment = await Comment.create({
    post: input.postId,
    author,
    content: input.content,
  });

  // Add the comment to the post's comments array
  await Post.findByIdAndUpdate(
    input.postId,
    { $push: { comments: newComment._id } },
    { new: true }
  );

  return {
    _id: newComment._id.toString(),
    post: newComment.post.toString(),
    author: newComment.author,
    content: newComment.content,
    createdAt: newComment.createdAt,
    updatedAt: newComment.updatedAt,
  };
};
