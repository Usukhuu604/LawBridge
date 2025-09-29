"use client";

import LawyerCard from "./LawyerCard";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ALL_LAWYERS } from "@/graphql/lawyer";
import { LoaderCircle } from "lucide-react";

const RecommendLawyers = () => {
  const { push } = useRouter();
  const {
    data: allLawyersData,
    loading: allLawyersLoading,
    error: allLawyersError,
  } = useQuery(GET_ALL_LAWYERS);

  if (allLawyersLoading)
    return (
      <div className="flex justify-center items-center my-6">
        <LoaderCircle className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    );
  if (allLawyersError) return <div>Алдаа гарлаа.</div>;

  const lawyers = [...(allLawyersData?.getLawyers || [])];

  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-[#1453b4] flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 text-center text-[#f8f8f8]">
      <div className="container mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-10 text-center flex flex-col items-center">
        <header className="mb-8 sm:mb-10 md:mb-12 w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#f8f8f8] mb-3 sm:mb-4 leading-tight">
            Өмгөөлөгчөө хайж олоорой
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-[#f8f8f8] opacity-80 max-w-2xl mx-auto leading-relaxed">
            Хуулийн мэргэжилтнүүдээс шууд цаг аван цаг аван өөрийн цагаа
            хэмнээрэй
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-center mb-8 sm:mb-10 w-full max-w-6xl">
          {lawyers.slice(0, 3).map(
            (
              lawyer: {
                lawyerId: string;
                firstName: string;
                lastName: string;
                profilePicture: string;
                status: string;
              },
              index
            ) => (
              <LawyerCard
                id={lawyer.lawyerId}
                key={lawyer.lawyerId || index}
                name={lawyer.firstName + " " + lawyer.lastName}
                avatarImage={lawyer.profilePicture}
                status={lawyer.status}
              />
            )
          )}
        </div>

        <div className="sm:mt-4">
          <Button
            onClick={() => push("/find-lawyers")}
            className="bg-[#D4AF37] text-[#333333] text-base sm:text-lg md:text-2xl p-4 sm:p-5 md:p-6 hover:cursor-pointer hover:opacity-85"
          >
            Бусад өмгөөлөгчдийг харах
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendLawyers;
