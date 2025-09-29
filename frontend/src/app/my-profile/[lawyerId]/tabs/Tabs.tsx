"use client";

import { useState } from "react";

import { FileText, Star, Calendar, UserPenIcon } from "lucide-react";
// import CreatePost from "./post/CreatePost";
import { ShowLawyerPosts } from "./ShowLawyerPosts";
import { LawyerReviews } from "./LawyerReviews";
import LawyerSchedule from "./LawyerSchedule";
import { LawyerProfileHeader } from "@/app/my-profile/[lawyerId]/tabs/LawyerHeader";
import { Button } from "@/components";

type TabType = "profile" | "posts" | "reviews" | "schedule" | "clients";

type SidebarTabsProps = {
  lawyerId: string;
};

const SidebarTabs = ({ lawyerId }: SidebarTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "profile",
      label: "Профайл",
      icon: <UserPenIcon className="w-4 h-4" />,
    },

    {
      id: "schedule",
      label: "Хуваарь",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "posts",
      label: "Нийтлэлүүд",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "reviews",
      label: "Сэтгэгдлүүд",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 shadow-none sm:shadow-sm overflow-hidden">
        <nav className="border-b border-gray-200">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="sm:hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabItems.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  className={`flex items-center gap-2 px-4 py-4 whitespace-nowrap border-b-2 transition-all duration-200 font-medium hover:cursor-pointer rounded-none justify-center min-w-max ${
                    activeTab === tab.id
                      ? "border-[#003366] text-[#003366] bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <span className="flex-shrink-0">{tab.icon}</span>
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4">
            {tabItems.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={`flex items-center gap-2 px-4 md:px-6 py-4 md:py-6 whitespace-nowrap border-b-2 transition-all duration-200 font-medium hover:cursor-pointer rounded-none justify-center ${
                  activeTab === tab.id
                    ? "border-[#003366] text-[#003366] bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="text-xs md:text-sm">{tab.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        <div className="w-full">
          <div className="">
            {activeTab === "profile" && <LawyerProfileHeader lawyerId={lawyerId} />}
            {activeTab === "schedule" && <LawyerSchedule lawyerId={lawyerId} />}
            {activeTab === "posts" && <ShowLawyerPosts lawyerId={lawyerId} />}
            {activeTab === "reviews" && <LawyerReviews />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTabs;
