"use client";

import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { GET_REVIEWS_BY_LAWYER } from "@/graphql/review";
import { GET_LAWYER_BY_LAWYERID_QUERY } from "@/graphql/lawyer";

export const LawyerReviews = () => {
  const params = useParams();
  const clerkLawyerId = typeof params?.lawyerId === "string" ? params.lawyerId : Array.isArray(params?.lawyerId) ? params.lawyerId[0] : "";

  const {
    data: lawyerData,
    loading: lawyerLoading,
    error: lawyerError,
  } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId: clerkLawyerId },
    skip: !clerkLawyerId,
  });

  const mongoLawyerId = lawyerData?.getLawyerById?._id;

  const {
    data,
    loading: reviewsLoading,
    error: reviewsError,
  } = useQuery(GET_REVIEWS_BY_LAWYER, {
    variables: { lawyerId: mongoLawyerId },
    skip: !mongoLawyerId,
  });

  const reviews = data?.getReviewsByLawyer || [];
  const totalClients = reviews.length;
  const loading = lawyerLoading || reviewsLoading;
  const error = lawyerError || reviewsError;

  // Badge logic
  let badge = "";
  let nextLevel = "";
  const current = totalClients;
  let max = 50;

  if (totalClients >= 50) {
    badge = "🏆 Elite Lawyer";
    max = 50;
  } else if (totalClients >= 20) {
    badge = "🥈 Pro Lawyer";
    nextLevel = "Elite Lawyer";
    max = 50;
  } else if (totalClients >= 10) {
    badge = "🥉 Good Lawyer";
    nextLevel = "Pro Lawyer";
    max = 20;
  } else {
    badge = "🔰 Шинэ өмгөөлөгч";
    nextLevel = "Good Lawyer";
    max = 10;
  }

  const progressPercent = Math.min((current / max) * 100, 100);

  // Helper functions for display name and initial
  const getDisplayName = (review: any) => {
    // If we have an email, use the part before @
    if (review.clientInfo?.email) {
      return review.clientInfo.email.split("@")[0];
    }

    // Use the name from clientInfo if available and it's not the same as clientId
    if (review.clientInfo?.name && review.clientInfo.name !== review.clientId) {
      return review.clientInfo.name;
    }

    // Fallback to client ID
    return review.clientId;
  };

  const getDisplayInitial = (review: any) => {
    const displayName = getDisplayName(review);
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <div className="sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pt-4">
      <div className="rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Амжилтын түвшин</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Нийт <span className="font-bold text-[#003366]">{totalClients}</span> захиалагч
            </p>
          </div>
          <div className="inline-flex items-center bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-lg sm:text-2xl font-bold text-[#003366]">{badge}</span>
          </div>
          {nextLevel && (
            <div className="text-sm sm:text-base text-gray-600">
              Дараагийн түвшин: <span className="font-semibold text-[#003366]">{nextLevel}</span>
            </div>
          )}
          <div className="max-w-xs sm:max-w-md mx-auto">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>{current}</span>
              <span>{max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div className="bg-[#003366] h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Үйлчлүүлэгчдийн сэтгэгдэл</h2>
        {loading ? (
          <div className="text-center text-gray-500">Уншиж байна...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            Алдаа гарлаа.
            {error?.message && <div className="mt-2 text-xs text-red-400">{error.message}</div>}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500">Одоогоор сэтгэгдэл алга.</div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {reviews.map((review: any, i: number) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-2 sm:p-6 shadow-none sm:shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-[#003366] font-medium text-sm sm:text-base">{getDisplayInitial(review)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{getDisplayName(review)}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center ml-11 sm:ml-0">
                    {[...Array(5)].map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className={`text-base sm:text-lg ${starIndex < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
