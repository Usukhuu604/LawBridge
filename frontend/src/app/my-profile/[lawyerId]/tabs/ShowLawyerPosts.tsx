"use client";

import { useQuery } from "@apollo/client";
import { GET_LAWYER_POSTS_BY_ID } from "@/graphql/post";
import { GET_LAWYER_BY_LAWYERID_QUERY } from "@/graphql/lawyer";
import { Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CommentModal } from "@/components/comment";
import Image from "next/image";
interface CommentType {
  _id: string;
  post: string;
  author: string;
  authorInfo: {
    id: string;
    name: string;
    email: string | null;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostType {
  _id: string;
  id: string;
  lawyerId: string;
  title: string;
  content: {
    text?: string;
    image?: string;
    video?: string;
    audio?: string;
  };
  specialization: Array<{
    id: string;
    categoryName: string;
  }>;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  createdAt: string;
  updatedAt?: string;
  comments?: CommentType[]; // Optional since lawyer posts query doesn't include comments
  author?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    username?: string;
    profilePicture?: string;
  };
}

type Props = {
  lawyerId: string;
};

export const ShowLawyerPosts = ({ lawyerId }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    refetch,
  } = useQuery(GET_LAWYER_POSTS_BY_ID, {
    variables: { lawyerId: lawyerId },
  });

  const {
    data: lawyerData,
    loading: lawyerLoading,
    error: lawyerError,
  } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId: lawyerId },
  });

  const loading = postsLoading || lawyerLoading;
  const error = postsError || lawyerError;

  // Clean URL function to fix double https issue
  const cleanUrl = (url: string | undefined) => {
    if (!url) return "";
    // Remove double https://
    return url.replace(/^https:\/\/https:\/\//, "https://");
  };

  // Format date in Mongolian
  const formatMongolianDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Дөнгөж сая";
    if (diffInMinutes < 60) return `${diffInMinutes} минутын өмнө`;
    if (diffInHours < 24) return `${diffInHours} цагийн өмнө`;
    if (diffInDays < 7) return `${diffInDays} өдрийн өмнө`;

    // For older posts, show actual date in Mongolian
    const months = [
      "1-р сар",
      "2-р сар",
      "3-р сар",
      "4-р сар",
      "5-р сар",
      "6-р сар",
      "7-р сар",
      "8-р сар",
      "9-р сар",
      "10-р сар",
      "11-р сар",
      "12-р сар",
    ];

    return `${date.getDate()}-ны ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const posts: PostType[] = postsData?.getPostsByLawyer || [];
  const lawyer = lawyerData?.getLawyerByLawyerId;

  // Show error only for critical errors (not comment-related)
  if (error && !postsData && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Алдаа гарлаа</h2>
          <p className="text-red-600 font-medium">{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Нийтлэл байхгүй байна</h3>
          <p className="text-gray-500">Та анхны нийтлэлээ бичээрэй.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Миний нийтлэлүүд</h2>
        <span className="text-sm text-gray-500">{posts.length} нийтлэл</span>
      </div>

      {/* Facebook-style Posts */}
      <div className="max-w-4xl mx-auto space-y-6">
        {posts.map((post) => (
          <article
            key={post._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Post Header - Author Info */}
            <div className="p-4 border-b border-gray-100">
              <div
                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:ring-opacity-50 rounded-lg p-1 -m-1 cursor-pointer"
                onClick={() => router.push(`/lawyer/${lawyerId}`)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#003365] focus:ring-opacity-50">
                  {post.author?.profilePicture || lawyer?.profilePicture || user?.imageUrl ? (
                    <Image
                      src={post.author?.profilePicture || lawyer?.profilePicture || user?.imageUrl || ""}
                      alt={`${post.author?.firstName || ""} ${post.author?.lastName || ""}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#003365] to-[#002a52] rounded-full flex items-center justify-center text-white font-semibold text-sm">${
                            (post.author?.firstName?.charAt(0) || "") + (post.author?.lastName?.charAt(0) || "") ||
                            user?.firstName?.charAt(0) ||
                            "Ө"
                          }</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#003365] to-[#002a52] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(post.author?.firstName?.charAt(0) || "") + (post.author?.lastName?.charAt(0) || "") ||
                        user?.firstName?.charAt(0) ||
                        "Ө"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {post.author?.firstName && post.author?.lastName
                        ? `${post.author.firstName} ${post.author.lastName}`
                        : post.author?.name
                        ? post.author.name
                        : post.author?.username
                        ? post.author.username
                        : "Өмгөөлөгч"}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">{post.createdAt ? formatMongolianDate(post.createdAt) : "Сүүлд шинэчлэгдсэн"}</p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4 space-y-4">
              {/* Post Title */}
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{post.title}</h3>

              {/* Post Text Content */}
              {post.content?.text && <div className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content.text}</div>}

              {/* Display Image */}
              {post.content?.image && (
                <div className="mt-4">
                  <Image
                    src={cleanUrl(post.content.image)}
                    alt="Post image"
                    width={800}
                    height={400}
                    className="w-full max-h-96 object-cover rounded-lg"
                    unoptimized
                    onError={(e) => {
                      console.error("Image failed to load:", cleanUrl(post.content.image));
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Display Video */}
              {post.content?.video && post.content.video !== "https://example.com/video.mp4" && (
                <div className="mt-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      controls
                      src={cleanUrl(post.content.video)}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      onError={(e) => {
                        console.error("Video failed to load:", cleanUrl(post.content.video));
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Display Audio */}
              {post.content?.audio && (
                <div className="mt-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <audio
                      controls
                      src={cleanUrl(post.content.audio)}
                      className="w-full"
                      onError={(e) => {
                        console.error("Audio failed to load:", cleanUrl(post.content.audio));
                        e.currentTarget.style.display = "none";
                      }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}

              {/* Specializations */}
              {post.specialization && post.specialization.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.specialization.map((spec: any) => (
                    <span
                      key={spec.id || spec._id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-[#003365] border border-gray-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {spec.categoryName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Footer - Engagement */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end items-end space-x-6">
                <CommentModal
                  postId={post._id}
                  comments={post.comments || []}
                  onCommentAdded={() => {
                    // Refetch posts to show new comment
                    refetch();
                  }}
                  onCommentDeleted={() => {
                    // Refetch posts to update comments
                    refetch();
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
