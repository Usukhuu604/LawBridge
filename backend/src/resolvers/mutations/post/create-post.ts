import { Post } from "@/models";
import { MutationResolvers, MediaType } from "@/types/generated";
import { GraphQLError } from "graphql";

export const createPost: MutationResolvers["createPost"] = async (
  _: unknown,
  { input },
  context
) => {
  const lawyerId = context.lawyerId;
  if (!lawyerId) {
    throw new GraphQLError(
      "Unauthorized: You must be an authenticated lawyer to create a post.",
      {
        extensions: { code: "UNAUTHENTICATED" },
      }
    );
  }

  let postType = MediaType.Text;
  if (input.content.image) postType = MediaType.Image;
  else if (input.content.video) postType = MediaType.Video;
  else if (input.content.audio) postType = MediaType.Audio;

  try {
    const newPost = await Post.create({
      lawyerId,
      title: input.title,
      content: input.content,
      specialization: input.specialization,
      type: postType,
    });

    await newPost.populate("specialization");

    return newPost as any;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new GraphQLError("Failed to create the post due to a server error.", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
