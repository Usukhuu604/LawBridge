import { Post } from "@/models";
import { QueryResolvers } from "@/types/generated";

export const getPostsByLawyer: QueryResolvers["getPostsByLawyer"] = async (
  _,
  { lawyerId }
) => {
  const posts = await Post.find({ lawyerId })
    .sort({ createdAt: -1 })
    .populate("specialization")
    .populate("comments");

  return posts.map((post) => ({
    id: post._id.toString(),
    _id: post._id.toString(),
    lawyerId: post.lawyerId,
    title: post.title,
    content: post.content,
    specialization: (post.specialization || [])
      .filter(
        (s) =>
          typeof s === "object" &&
          s !== null &&
          Object.prototype.hasOwnProperty.call(s, "categoryName")
      )
      .map((s) => {
        const spec = s as any;
        return {
          id: spec._id.toString(),
          _id: spec._id.toString(),
          categoryName: spec.categoryName,
        };
      }),
    type: post.type as any, // Cast to MediaType if needed
    comments: (post.comments || []).map((comment: any) => ({
      _id: comment._id.toString(),
      post: comment.post.toString(),
      author: comment.author,
      authorInfo: {
        id: comment.author,
        name: comment.author,
        email: null,
      },
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));
};
