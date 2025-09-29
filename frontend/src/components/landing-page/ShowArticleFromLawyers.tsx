"use client";
import React from "react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { GET_ALL_POSTS_FROM_LAWYERS } from "@/graphql/post";
import { useQuery } from "@apollo/client";
import { LawyerArticleCard } from "./LawyerArticleCard";
import { LoaderCircle } from "lucide-react";

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

const ShowArticleFromLawyers = () => {
  const { push } = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_POSTS_FROM_LAWYERS);
  const allLawyersPosts: ArticleType[] = data?.getPosts || [];

  if (error) console.log(error.message);

  return (
    <section className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-gradient-to-t from-[#003366] to-[#1453b4] flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 text-center text-[#f8f8f8]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#f8f8f8] mb-3 sm:mb-4">
          Мэргэжилтнүүдийн нийтлэлийг унших
        </h2>
        <p className="text-base sm:text-xl text-[#f8f8f8] opacity-80 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Манай хуулийн мэргэжилтнүүдийн нийтлэл, зөвлөгөөг үнэгүй авч байгаарай
        </p>

        {loading && (
          <div className="flex justify-center items-center my-6">
            <LoaderCircle className="animate-spin w-8 h-8 text-gray-300" />
          </div>
        )}

        {error && <p className="text-red-300 mb-6">Алдаа: {error.message}</p>}

        <article className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {allLawyersPosts.slice(0, 3).map((article) => (
            <LawyerArticleCard key={article._id} article={article} />
          ))}
        </article>

        <div className="mt-8 sm:mt-10 md:mt-12">
          <Button
            onClick={() => push("/legal-articles")}
            className="bg-[#D4AF37] text-[#333333] text-lg sm:text-lg md:text-2xl p-4 sm:p-5 md:p-6 hover:cursor-pointer hover:opacity-85"
          >
            Бүх нийтлэлийг унших
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShowArticleFromLawyers;
