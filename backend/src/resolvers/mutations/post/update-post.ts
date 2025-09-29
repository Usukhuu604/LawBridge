// src/graphql/resolvers/mutations/updatePost.ts

import { Post } from "@/models";
import { MutationResolvers } from "@/types/generated";
import { GraphQLError } from "graphql";

export const updatePost: MutationResolvers["updatePost"] = async (
  _,
  { postId, input },
  context
) => {
  const  lawyerId  = context.lawyerId;
  if (!lawyerId) {
    throw new GraphQLError(
      "Unauthorized: You must be logged in to update a post.",
      {
        extensions: { code: "UNAUTHENTICATED" },
      }
    );
  }

  const postToUpdate = await Post.findById(postId);

  if (!postToUpdate) {
    throw new GraphQLError("Post not found.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  if (postToUpdate.lawyerId.toString() !== lawyerId) {
    throw new GraphQLError("Forbidden: You are not the owner of this post.", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: input }, 
      { new: true }
    );

    if (!updatedPost) {
      throw new GraphQLError("Failed to update the post.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }

    await updatedPost.populate("specialization");

    return updatedPost as any;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new GraphQLError(
      "An internal error occurred while updating the post.",
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      }
    );
  }
};
