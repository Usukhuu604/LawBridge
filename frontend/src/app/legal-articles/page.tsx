"use client";

import { useState } from "react";
import { Button } from "@/components";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS } from "@/graphql/post";
import { Search, Filter, Tag, ChevronRight, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import CreatePostModal from "@/components/post/CreatePostModal";
import { CommentModal } from "@/components/comment";
import { useRouter } from "next/navigation";

const ArticlesPage = () => {
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const isLawyer = role === "lawyer";
  const router = useRouter();

  const {
    data: specData,
    loading: specLoading,
    error: specError,
  } = useGetAdminSpecializationsQuery();
  const {
    data: postData,
    loading: postLoading,
    error: postError,
    refetch,
  } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: "network-only",
  });

  // Specializations and posts data
  const specializations = specData?.getAdminSpecializations || [];
  const posts = postData?.getPosts || [];

  // Multi-select logic
  const handleFilter = (specId: string) => {
    setSelectedSpecIds((prev) =>
      prev.includes(specId)
        ? prev.filter((id) => id !== specId)
        : [...prev, specId]
    );
  };
  const clearFilters = () => {
    setSelectedSpecIds([]);
    setSearchTerm("");
  };

  console.log(posts);

  // Clean URL function to fix double https issue
  const cleanUrl = (url: string) => {
    if (!url) return url;
    // Remove double https://
    return url.replace(/^https:\/\/https:\/\//, "https://");
  };

  // Filtering logic
  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch =
      !searchTerm ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.text?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpec =
      selectedSpecIds.length === 0 ||
      post.specialization?.some((spec: any) =>
        selectedSpecIds.includes(spec.id || spec._id)
      );

    return matchesSearch && matchesSpec;
  });

  if (!isLoaded || specLoading || postLoading) {
    return (
      <div className="min-h-screen md:mt-100 mt-20 bg-transparent ">
        <div className="text-center space-y-4 bg-transparent">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003365] mx-auto bg-transparent"></div>
        </div>
      </div>
    );
  }

  if (specError || postError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Алдаа гарлаа</h2>
          <p className="text-gray-600">
            {specError?.message || postError?.message}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Дахин оролдох
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#003366] text-white py-8 sm:py-10 md:py-12 lg:py-16 relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 z-30">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg text-center sm:text-left">
            Хуулийн нийтлэлүүд
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-slate-200 font-medium drop-shadow-sm text-center sm:text-left leading-relaxed">
            Хуулийн мэргэжилтнүүдийн туршлага, зөвлөгөө болон сүүлийн үеийн
            хуулийн мэдээллүүд
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8 relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Нийтлэл хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-lg sm:rounded-xl hover:from-gray-50 hover:to-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-lg sm:rounded-xl hover:from-gray-50 hover:to-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md flex-1 sm:flex-none"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Ангилал</span>
                <span className="xs:hidden">Ангилал</span>
                <span className="text-xs">({specializations.length})</span>
                <ChevronRight
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${
                    showFilters ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {(selectedSpecIds.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium border border-blue-300 hover:border-blue-400 flex items-center space-x-1 sm:space-x-2 hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Цэвэрлэх</span>
                  <span className="xs:hidden">Цэвэрлэх</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          {showFilters && (
            <div className="pt-4 sm:pt-6">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {specializations.map(
                  (spec: { id: string; categoryName: string }) => (
                    <Button
                      key={spec.id}
                      variant={
                        selectedSpecIds.includes(spec.id)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleFilter(spec.id)}
                      className={`
                      px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105

                        ${
                          selectedSpecIds.includes(spec.id)
                            ? "bg-[#003365] text-white shadow-lg border-[#003365]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#003365] hover:text-[#003365] hover:bg-gray-50"
                        }
                    `}
                    >
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {spec.categoryName}
                      </span>
                    </Button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(selectedSpecIds.length > 0 || searchTerm) && (
            <div className="flex flex-wrap gap-2 sm:gap-3 border-t border-gray-100 pt-3 sm:pt-4 justify-center">
              <span className="text-xs sm:text-sm text-gray-500 font-medium w-full text-center sm:w-auto">
                Идэвхтэй шүүлтүүр:
              </span>

              {selectedSpecIds.map((specId) => {
                const spec = specializations.find((s) => s.id === specId);
                return (
                  <div
                    key={specId}
                    className="flex items-center bg-white border border-blue-300 text-blue-700 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg text-xs sm:text-sm shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 font-medium group"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1.5 sm:mr-2"></div>
                    <span className="truncate max-w-[100px] sm:max-w-none">
                      {spec?.categoryName}
                    </span>
                    <button
                      onClick={() => handleFilter(specId)}
                      className="ml-1.5 sm:ml-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 p-0.5 rounded-full transition-all duration-200 group-hover:bg-blue-200"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                );
              })}
              {searchTerm && (
                <div className="flex items-center bg-white border border-green-300 text-green-700 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg text-xs sm:text-sm shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 font-medium group">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></div>
                  <Search className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  <span className="truncate max-w-[100px] sm:max-w-none">
                    &quot;{searchTerm}&quot;
                  </span>

                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1.5 sm:ml-2 text-green-400 hover:text-green-600 hover:bg-green-100 p-0.5 rounded-full transition-all duration-200 group-hover:bg-green-200"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isLawyer && (
          <div className="pt-3 sm:pt-4 flex justify-center">
            <CreatePostModal />
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            {selectedSpecIds.length > 0
              ? `Сонгогдсон ангиллууд`
              : searchTerm
              ? `"${searchTerm}" хайлтын үр дүн`
              : "Бүх нийтлэлүүд"}
          </h2>
        </div>

        {/* Facebook-style Newsfeed */}
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 col-span-full bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg">
              <div className="max-w-md mx-auto px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-base sm:text-lg font-semibold mb-2">
                  Таны хайлтын нөхцөлд тохирох нийтлэл олдсонгүй
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  Шүүлтүүрүүдийг өөрчилж, хайлтын үгүүдийг өөрчилж үзээрэй.
                </p>
                {(selectedSpecIds.length > 0 || searchTerm) && (
                  <Button
                    onClick={clearFilters}
                    className="mt-3 sm:mt-4 bg-[#003365] text-white hover:bg-[#002a52] hover:text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                  >
                    Бүх нийтлэлийг харах
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredPosts.map((post: any) => (
                <article
                  key={post._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Post Header - Author Info */}
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div
                      className="flex items-center space-x-2 sm:space-x-3 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:ring-opacity-50 rounded-lg p-1 -m-1"
                      onClick={() => router.push(`/lawyer/${post.author?._id}`)}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#003365] focus:ring-opacity-50 flex-shrink-0">
                        {(() => {
                          console.log("🔍 Post author data:", post.author);
                          console.log(
                            "🖼️ Profile picture URL:",
                            post.author?.profilePicture
                          );
                          const profilePicUrl = post.author?.profilePicture
                            ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${post.author.profilePicture}`
                            : null;
                          console.log(
                            "🔗 Full profile picture URL:",
                            profilePicUrl
                          );
                          return null;
                        })()}
                        {post.author?.profilePicture ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${post.author.profilePicture}`}
                            alt={`${post.author?.firstName || ""} ${
                              post.author?.lastName || ""
                            }`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#003365] to-[#002a52] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(post.author?.firstName?.charAt(0) || "") +
                              (post.author?.lastName?.charAt(0) || "") || "Ө"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {post.author?.firstName && post.author?.lastName
                              ? `${post.author.firstName} ${post.author.lastName}`
                              : post.author?.name
                              ? post.author.name
                              : post.author?.username
                              ? post.author.username
                              : "Өмгөөлөгч"}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString(
                                "mn-MN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Сүүлд шинэчлэгдсэн"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Post Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      {post.title}
                    </h3>

                    {/* Post Text Content */}
                    {post.content?.text && (
                      <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content.text}
                      </div>
                    )}

                    {/* Display Image */}
                    {post.content?.image && (
                      <div className="mt-3 sm:mt-4">
                        <img
                          src={cleanUrl(post.content.image)}
                          alt="Post image"
                          className="w-full max-h-64 sm:max-h-96 object-cover rounded-lg"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              cleanUrl(post.content.image)
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Display Video */}
                    {post.content?.video &&
                      post.content.video !==
                        "https://example.com/video.mp4" && (
                        <div className="mt-3 sm:mt-4">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <video
                              controls
                              src={cleanUrl(post.content.video)}
                              className="w-full h-full object-cover"
                              preload="metadata"
                              onError={(e) => {
                                console.error(
                                  "Video failed to load:",
                                  cleanUrl(post.content.video)
                                );
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}

                    {/* Display Audio */}
                    {post.content?.audio && (
                      <div className="mt-3 sm:mt-4">
                        <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                          <audio
                            controls
                            src={cleanUrl(post.content.audio)}
                            className="w-full"
                            onError={(e) => {
                              console.error(
                                "Audio failed to load:",
                                cleanUrl(post.content.audio)
                              );
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
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {post.specialization.map((spec: any) => (
                          <span
                            key={spec.id || spec._id}
                            className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-[#003365] border border-gray-200"
                          >
                            <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            <span className="truncate max-w-[100px] sm:max-w-none">
                              {spec.categoryName}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Footer - Engagement */}
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-end items-end space-x-4 sm:space-x-6">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
