import { Post } from "@/models";
import { MutationResolvers } from "@/types/generated";

export const deletePost: MutationResolvers["deletePost"] = async (
  _: unknown,
  { postId },
  context
) => {
  const  lawyerId  = context.lawyerId;
  if (!lawyerId) throw new Error("Unauthorized: Lawyer not authenticated");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  if (post.lawyerId !== lawyerId)
    throw new Error("Not authorized to delete this post");

  await Post.deleteOne({ _id: postId });

  return true; 
};
