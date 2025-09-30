"use client";

import { useState } from "react";
import CreateComment from "@/components/comment/CreateComment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PostType {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  comments: string[];
  createdAt: string;
}

export const GetPost = () => {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 1,
      content: "Хэрэг шийдвэрлээд баяртай байна!",
      mediaUrl:
        "https://www.totallylegal.com/getasset/c3ee2a89-b973-445f-9337-1ca05736c950/",
      mediaType: "image",
      comments: ["Сайн байна!", "Амжилт хүсье!"],
      createdAt: "2025-07-08",
    },
    {
      id: 2,
      content: "Шинэ хууль дээр тайлбар хийлээ.",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      mediaType: "video",
      comments: [],
      createdAt: "2025-07-06",
    },
    {
      id: 3,
      content: "Энгийн текст пост ямар байдлаар харагдаж байгааг шалгаж байна.",
      comments: [],
      createdAt: "2025-07-05",
    },
  ]);

  return (
    <div className="space-y-5 flex flex-col items-center">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="bg-gray-300 border-none text-black shadow-lg md:w-180"
        >
          <CardHeader className="text-sm text-gray-200">
            {post.createdAt}
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xl font-bold">“{post.content}”</p>

            {post.mediaType === "image" && post.mediaUrl && (
              <img
                src={post.mediaUrl}
                alt="post"
                className="rounded-md w-full max-h-96 object-cover"
              />
            )}

            {post.mediaType === "video" && post.mediaUrl && (
              <div className="aspect-video">
                <iframe
                  src={post.mediaUrl}
                  className="w-full h-full rounded-md"
                  allowFullScreen
                />
              </div>
            )}

            {/* Comments */}
            <div className="bg-white text-black p-3 rounded-md space-y-2">
              <p className="text-sm font-semibold">Сэтгэгдлүүд</p>
              {post.comments.length > 0 ? (
                post.comments.map((c, i) => (
                  <p key={i} className="text-sm pl-2">
                    • {c}
                  </p>
                ))
              ) : (
                <p className="text-sm italic text-gray-500">Сэтгэгдэл алга</p>
              )}
              <CreateComment
                postId={post.id.toString()}
                onCommentAdded={() => {
                  // Refetch posts or update local state
                  console.log("Comment added, refreshing...");
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
