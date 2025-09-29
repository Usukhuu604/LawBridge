import { Post } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const searchPosts: QueryResolvers["searchPosts"] = async (
  _:unknown,
  { query },
  context
) => {
  const regex = new RegExp(query, "i");

  const posts = await Post.find({
    $or: [
      { title: { $regex: regex } },
      { "content.text": { $regex: regex } }, 
    ],
  }).sort({ createdAt: -1 });

  return posts.map((post) => ({
    _id: post._id.toString(),
    lawyerId: post.lawyerId,
    title: post.title,
    content: post.content,
    specialization: post.specialization.map((specialization) => specialization.toString()),
    type: post.type,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));
};
