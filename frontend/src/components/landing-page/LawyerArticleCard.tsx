import { useQuery } from "@apollo/client";
import { GET_LAWYER_BY_LAWYERID_QUERY } from "@/graphql/lawyer";
import React from "react";
import { useRouter } from "next/navigation";

type ArticleType = {
  _id: string;
  id: string;
  lawyerId: string;
  title: string;
  content:
    | string
    | { text?: string; image?: string; video?: string; audio?: string };
  specialization: Array<{ id: string; categoryName: string }>;
  type: string;
  createdAt: string;
  updatedAt?: string;
};

export const LawyerArticleCard = ({ article }: { article: ArticleType }) => {
  const router = useRouter();
  const { data: lawyerData, loading } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId: article.lawyerId },
    skip: !article.lawyerId,
  });

  const handleReadMoreClick = () => {
    if (article.lawyerId) {
      router.push(`/lawyer/${article.lawyerId}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 ">
      <div className="p-6 sm:p-7 flex flex-col flex-grow">
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <div>
              <div className="text-lg font-semibold text-[#003366]">
                {loading ? (
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `${lawyerData?.getLawyerById?.firstName || "Anonymous"} ${
                    lawyerData?.getLawyerById?.lastName || ""
                  }`
                )}
              </div>
            </div>
          </div>

          {/* Read more indicator */}
          <div
            className="text-[#003366] group-hover:text-[#1453b4] cursor-pointer hover:scale-110 transform transition-all duration-200"
            onClick={handleReadMoreClick}
            title="Хуульчийн мэдээлэл харах"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#003366] mb-3 sm:mb-4  pt-3 transition-colors duration-200">
          {article.title}
        </h3>

        {/* Content */}
        <p className="text-gray-800 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-5 flex-grow  ">
          {typeof article.content === "string"
            ? article.content
            : article.content?.text || ""}
        </p>
        <div className="flex justify-end items-center mb-4">
          <span className="text-base sm:text-lg text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
