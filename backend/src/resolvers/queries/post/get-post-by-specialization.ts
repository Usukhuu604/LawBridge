import { Post } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getPostsBySpecializationId: QueryResolvers["getPostsBySpecializationId"] =
  async (  _:unknown,
    { specializationId }, context) => {
    const posts = await Post.find({
      specialization: { $in: [specializationId] }, 
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
