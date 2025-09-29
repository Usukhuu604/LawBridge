"use client";

import {
  useClerkUserEmail,
  getUsernameFromEmail,
  getInitialsFromEmail,
} from "@/hooks/useClerkUserEmail";

interface UserDisplayNameProps {
  userId: string;
  isLawyer: boolean;
  lawyerName?: string;
  lawyerAvatar?: string;
  lawyerInitial?: string;
  className?: string;
}

export default function UserDisplayName({
  userId,
  isLawyer,
  lawyerName,
  className = "",
}: Omit<UserDisplayNameProps, "lawyerAvatar" | "lawyerInitial">) {
  const userData = useClerkUserEmail(userId);

  if (isLawyer) {
    // For lawyers, use the provided lawyer data
    return <span className={className}>{lawyerName || "Өмгөөлөгч"}</span>;
  }

  // For clients, use email data from Clerk
  if (userData?.email) {
    const username = getUsernameFromEmail(userData.email);
    return <span className={className}>{username}</span>;
  }

  // Fallback while loading
  return <span className={className}>Loading...</span>;
}

export function UserAvatar({
  userId,
  isLawyer,
  lawyerInitial,
  className = "w-12 h-12",
}: Omit<UserDisplayNameProps, "lawyerName" | "className"> & {
  className?: string;
}) {
  const userData = useClerkUserEmail(userId);

  if (isLawyer) {
    // For lawyers, use the provided lawyer data
    return (
      <div
        className={`${className} rounded-full bg-[#003366] flex items-center justify-center text-white font-semibold`}
      >
        {lawyerInitial || "Ө"}
      </div>
    );
  }

  // For clients, use email data from Clerk
  if (userData?.email) {
    const initial = getInitialsFromEmail(userData.email);
    return (
      <div
        className={`${className} rounded-full bg-[#003366] flex items-center justify-center text-white font-semibold`}
      >
        {initial}
      </div>
    );
  }

  // Fallback while loading
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold`}
    >
      ?
    </div>
  );
}
