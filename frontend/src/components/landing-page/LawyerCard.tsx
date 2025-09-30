"use client";

import { Badge } from "@/components/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GET_SPECIALIZATION_BY_LAWYER_ID } from "@/graphql/specializationsbylawyer";
import { useQuery } from "@apollo/client";
import { CheckCircle } from "lucide-react";

type LawyerCardProps = {
  id: string;
  name: string;
  status: string;
  avatarImage?: string;
  rating?: number;
  reviewCount?: number;
};

const LawyerCard = ({ id, name, status, avatarImage }: LawyerCardProps) => {
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState<
    number | null
  >(null);

  const { data: specializationData, loading: specialLoad } = useQuery(
    GET_SPECIALIZATION_BY_LAWYER_ID,
    {
      variables: { lawyerId: id },
    }
  );

  const handleClick = (index: number) => {
    setActiveSpecialtyIndex(activeSpecialtyIndex === index ? null : index);
  };

  const router = useRouter();

  const handleDelgerenguiClick = () => {
    router.push(`/lawyer/${id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100/50 h-full flex flex-col group backdrop-blur-sm min-h-[340px] max-h-[380px] hover:-translate-y-1 hover:border-blue-200/50"
      onClick={handleDelgerenguiClick}
    >
      <div className="flex flex-col h-full">
        {/* Header Section with Background - Enhanced */}
        <div className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] p-4 sm:p-5 rounded-t-2xl relative overflow-hidden h-[110px] sm:h-[120px] group-hover:from-[#002244] group-hover:via-[#003366] group-hover:to-[#002244] transition-all duration-500">
          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-transparent pointer-events-none group-hover:from-white/20 group-hover:via-white/10 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none group-hover:from-black/20 transition-all duration-500"></div>

          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          {/* Enhanced Approved Checkbox - Top Right */}
          {status === "Баталгаажсан" && (
            <div className="absolute top-3 right-3 z-20 group-hover:scale-110 transition-transform duration-300">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-white/60 group-hover:border-emerald-300 group-hover:shadow-emerald-200/50 transition-all duration-300">
                <CheckCircle className="w-4 h-4 text-emerald-600 group-hover:text-emerald-500 transition-colors duration-300" />
              </div>
            </div>
          )}

          {/* Avatar and Name Section - Enhanced */}
          <div className="flex items-center h-full relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 ring-3 ring-white/50 shadow-xl group-hover:ring-white/80 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
              {avatarImage ? (
                <img
                  src={(
                    process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN +
                    "/" +
                    avatarImage
                  ).trim()}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-white/30 flex items-center justify-center text-white font-bold text-lg group-hover:bg-white/40 transition-all duration-300">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight break-words tracking-tight drop-shadow-lg group-hover:text-white group-hover:drop-shadow-xl transition-all duration-300">
                {name}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Section - Enhanced */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 bg-gradient-to-b from-white via-gray-50/20 to-gray-100/30 group-hover:from-white group-hover:via-blue-50/20 group-hover:to-blue-100/30 transition-all duration-500">
          {/* Status Section - Enhanced */}
          {status === "Хүлээгдэж буй" && (
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center">
                <div className="flex items-center bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                  <div className="w-2.5 h-2.5 mr-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                  Хүлээгдэж буй
                </div>
              </div>
            </div>
          )}

          {/* Specializations Section - Enhanced */}
          <div className="flex-1 min-h-[80px] sm:min-h-[90px] mb-3 sm:mb-4">
            {specialLoad ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-sm text-gray-500">
                  Ачааллаж байна...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                {specializationData?.getSpecializationsByLawyer.slice(0, 2).map(
                  (
                    spec: {
                      specializationId: string;
                      categoryName: string;
                      pricePerHour: number | null;
                    },
                    index: number
                  ) => (
                    <Badge
                      key={spec.specializationId}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(index);
                      }}
                      variant="default"
                      className={`
                        px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer w-full text-center
                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
                        border shadow-md transform hover:scale-105 hover:-translate-y-0.5
                        group-hover:shadow-lg min-h-[60px] flex flex-col justify-center overflow-hidden
                        ${
                          activeSpecialtyIndex === index
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-xl scale-105 -translate-y-0.5"
                            : "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:text-blue-800 hover:shadow-lg"
                        }
                      `}
                    >
                      <span className="block text-xs sm:text-sm leading-tight break-words hyphens-auto overflow-hidden max-w-full">
                        {spec.categoryName}
                      </span>
                      {activeSpecialtyIndex === index && (
                        <span className="block text-xs mt-1 opacity-90 break-words hyphens-auto overflow-hidden max-w-full">
                          {spec.pricePerHour
                            ? `₮${spec.pricePerHour.toLocaleString()}/цаг`
                            : "үнэгүй"}
                        </span>
                      )}
                    </Badge>
                  )
                )}
              </div>
            )}
          </div>

          {/* Button Section - Enhanced */}
          <button className="w-full bg-gradient-to-r from-[#003366] to-[#004080] text-white py-3 sm:py-4 rounded-xl hover:from-[#002244] hover:to-[#003366] transition-all duration-300 font-bold shadow-lg hover:shadow-xl group-hover:shadow-2xl text-sm sm:text-base transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0">
            Мэдээлэл харах
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
