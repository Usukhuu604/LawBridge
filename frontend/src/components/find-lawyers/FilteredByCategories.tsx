"use client";

import { useState, useEffect, useRef } from "react";
import LawyerCard from "@/components/landing-page/LawyerCard";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { useQuery } from "@apollo/client";
import { GET_ALL_LAWYERS } from "@/graphql/lawyer";
import { Verified, ChevronDown, ChevronUp, X } from "lucide-react";

interface Category {
  id: string;
  categoryName: string;
}

interface Specialization {
  _id: string;
  specializationId: string;
  categoryName: string;
  lawyerId: string;
  subscription: boolean;
  pricePerHour: number;
}

interface Lawyer {
  id: string;
  lawyerId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  status: string;
  specialization: Specialization[];
  rating?: number;
  reviewCount?: number;
}

const FilteredByCategories = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useGetAdminSpecializationsQuery();

  const {
    data: allLawyersData,
    loading: allLawyersLoading,
    error: allLawyersError,
  } = useQuery(GET_ALL_LAWYERS);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (allLawyersLoading) return <div>Түр хүлээнэ үү...</div>;
  if (allLawyersError) return <div>Алдаа гарлаа.</div>;

  const lawyers: Lawyer[] = allLawyersData?.getLawyers || [];

  // 🔍 Filter lawyers by selected specializationIds and verification status
  const filteredLawyers = lawyers.filter((lawyer) => {
    // First filter: Only show verified lawyers
    if (lawyer.status !== "VERIFIED") return false;

    // Second filter: Filter by selected specializations
    if (selectedSpecialties.length === 0) return true;

    if (Array.isArray(lawyer.specialization)) {
      return lawyer.specialization.some((spec) =>
        selectedSpecialties.includes(spec.specializationId)
      );
    }

    return false;
  });

  const handleSpecialtyToggle = (specialtyId: string) => {
    setSelectedSpecialties((prev) => {
      if (prev.includes(specialtyId)) {
        return prev.filter((id) => id !== specialtyId);
      } else {
        return [...prev, specialtyId];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedSpecialties([]);
  };

  const specializations = data?.getAdminSpecializations || [];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#003366] text-white py-12 relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 z-30">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight drop-shadow-lg">
            Өөрт тохирох хуульчийг сонгоорой
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 font-medium drop-shadow-sm">
            Мэргэшсэн хуульчид таныг хүлээж байна
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 relative z-20 min-h-[100px] sm:min-h-[120px]">
          {/* Filters */}
          <div className="w-full mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <span className="text-slate-800 font-bold text-sm sm:text-base whitespace-nowrap tracking-wide">
                Шүүлтүүр:
              </span>
              <div
                className="relative flex-1 w-full sm:max-w-2xl z-20"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-xl hover:from-gray-50 hover:to-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <span className="text-sm text-gray-700">
                    {selectedSpecialties.length > 0
                      ? `${selectedSpecialties.length} ангилал сонгогдсон`
                      : "Ангилал сонгох"}
                  </span>
                  {showFilterDropdown ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-25 w-full sm:w-[38rem] md:w-[44rem] lg:w-[50rem] xl:w-[56rem] max-h-[60rem] overflow-visible scrollbar-hide animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-visible scrollbar-hide max-h-[58rem]">
                      {/* Header Section */}
                      <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                            Ангилал сонгох
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 ml-11">
                          Өөрт тохирох хуульчдын мэргэшлийн чиглэлийг сонгоно уу
                        </p>
                      </div>
                      {/* Selected Filters Summary - Inside Dropdown */}
                      {selectedSpecialties.length > 0 && (
                        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="text-base font-bold text-blue-800">
                                Сонгосон шүүлтүүр ({selectedSpecialties.length})
                              </span>
                            </div>
                            <button
                              onClick={clearAllFilters}
                              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium border border-blue-300 hover:border-blue-400 flex items-center space-x-2 hover:scale-105 active:scale-95"
                            >
                              <X className="w-4 h-4" />
                              <span>Бүгдийг цэвэрлэх</span>
                            </button>
                          </div>

                          {/* Selected Filter Tags */}
                          <div className="flex flex-wrap gap-3">
                            {selectedSpecialties.map((specialtyId) => {
                              const specialty = specializations.find(
                                (s) => s.id === specialtyId
                              );
                              return (
                                <div
                                  key={specialtyId}
                                  className="flex items-center bg-white border border-blue-300 text-blue-700 px-4 py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 font-medium group"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                  <span>{specialty?.categoryName}</span>
                                  <button
                                    onClick={() =>
                                      handleSpecialtyToggle(specialtyId)
                                    }
                                    className="ml-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 p-0.5 rounded-full transition-all duration-200 group-hover:bg-blue-200"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Filter Options Grid */}
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wide">
                              Боломжтой ангилалууд
                            </h4>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {specializations.length} ангилал
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 overflow-visible relative z-30">
                          {specializations.map((spec: Category) => (
                            <label
                              key={spec.id}
                              className="flex items-center space-x-2 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md group min-h-[45px] overflow-hidden relative z-40"
                            >
                              <div className="relative flex-shrink-0">
                                <input
                                  type="checkbox"
                                  checked={selectedSpecialties.includes(
                                    spec.id
                                  )}
                                  onChange={() =>
                                    handleSpecialtyToggle(spec.id)
                                  }
                                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200 accent-blue-600 hover:scale-105"
                                />
                              </div>
                              <span className="text-xs sm:text-sm text-gray-700 flex-1 leading-tight font-medium group-hover:text-blue-700 transition-colors duration-200 break-words hyphens-auto">
                                {spec.categoryName}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 relative z-10">
          {filteredLawyers?.length > 0 ? (
            filteredLawyers.map((lawyer, index) => (
              <LawyerCard
                id={lawyer.lawyerId}
                key={lawyer.lawyerId || index}
                name={`${lawyer.firstName} ${lawyer.lastName}`}
                avatarImage={lawyer.profilePicture}
                status={
                  lawyer.status === "VERIFIED"
                    ? "Баталгаажсан"
                    : "Хүлээгдэж буй"
                }
              />
            ))
          ) : (
            <div className="text-center py-16 col-span-full bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Verified className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg font-semibold mb-2">
                  Таны хайлтын нөхцөлд тохирох хуульч олдсонгүй
                </p>
                <p className="text-gray-500">
                  Шүүлтүүрүүдийг өөрчилж, хайлтын үгүүдийг өөрчилж үзээрэй.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredByCategories;
