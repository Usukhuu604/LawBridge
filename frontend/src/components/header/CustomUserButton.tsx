"use client";

import { useQuery } from "@apollo/client";
import { UserButton, useClerk } from "@clerk/nextjs";
import { GET_LAWYER_BY_LAWYERID_QUERY } from "@/graphql/lawyer";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomUserButtonProps {
  afterSignOutUrl?: string;
  userProfileMode?: "navigation" | "modal";
  userProfileUrl?: string;
}

export default function CustomUserButton({
  afterSignOutUrl = "/sign-in",
  // userProfileMode = "modal",
  userProfileUrl,
}: CustomUserButtonProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const role = user?.publicMetadata?.role as string | undefined;
  const userId = user?.id;

  // Only fetch lawyer data if user is a lawyer
  const { data: lawyerData, loading: lawyerLoading } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId: userId },
    skip: role !== "lawyer" || !userId,
    fetchPolicy: "cache-first",
  });

  const lawyer = lawyerData?.getLawyerById;
  const profilePicture = lawyer?.profilePicture;

  // If user is not a lawyer or no profile picture, use default Clerk UserButton
  if (role !== "lawyer" || !profilePicture || lawyerLoading) {
    return <UserButton afterSignOutUrl={afterSignOutUrl} />;
  }

  const handleSignOut = () => {
    signOut();
    if (afterSignOutUrl) {
      window.location.href = afterSignOutUrl;
    }
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileNavigation = () => {
    if (userProfileUrl) {
      window.location.href = userProfileUrl;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={handleProfileClick} className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${profilePicture}`}
            alt={`${lawyer.firstName} ${lawyer.lastName}`}
            width={32}
            height={32}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#003365] to-[#002a52] rounded-full flex items-center justify-center text-white font-semibold text-sm">${
                  (lawyer.firstName?.charAt(0) || "") + (lawyer.lastName?.charAt(0) || "") || "Ө"
                }</div>`;
              }
            }}
          />
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {lawyer.firstName} {lawyer.lastName}
            </p>
            <p className="text-xs text-gray-500">{lawyer.email}</p>
          </div>
          <button onClick={handleProfileNavigation} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Профайл
          </button>
          <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Гарах
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
