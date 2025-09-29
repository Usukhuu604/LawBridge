"use client";

import { useState, useEffect } from "react";
import {
  getUsernameFromEmail,
  generateMockEmailFromUserId,
} from "./useClerkUserEmail";

import { useQuery } from "@apollo/client";
import { GET_ALL_LAWYERS } from "@/graphql/lawyer";

// Note: GET_LAWYER_BY_CLERK_USER_ID query removed as it's not supported by the backend

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  initial: string;
  userType: "lawyer" | "client";
  email?: string;
  isOnline?: boolean;
  displayName?: string; // What to display in the chat header
}

// Cache to store fetched user data
const userInfoCache = new Map<string, UserInfo>();

// Helper function to extract Clerk user ID from JWT token
function extractUserIdFromToken(token: string): string | null {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null; // 'sub' field contains the user ID
  } catch (error) {
    console.warn("Failed to extract user ID from token:", error);
    return null;
  }
}

export function useUserInfo(userId: string): UserInfo | null {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [clientLoading, setClientLoading] = useState(false);

  // Extract actual user ID if a JWT token was passed
  const actualUserId = userId.startsWith("user_")
    ? userId
    : extractUserIdFromToken(userId);

  // Try to get lawyer data by clerkUserId first
  const { data: lawyersData, loading: lawyerLoading } = useQuery(
    GET_ALL_LAWYERS,
    {
      skip: !actualUserId,
      errorPolicy: "all",
    }
  );

  // Find lawyer by clerkUserId
  const lawyerData = lawyersData?.getLawyers?.find(
    (lawyer: any) => lawyer.clerkUserId === actualUserId
  );

  const finalLawyerData = lawyerData;

  useEffect(() => {
    if (!actualUserId) return;

    // Check cache first
    if (userInfoCache.has(actualUserId)) {
      setUserInfo(userInfoCache.get(actualUserId)!);
      return;
    }

    // ROLE CHECK: If user is a lawyer (has lawyer data from MongoDB)
    if (finalLawyerData && !lawyerLoading) {
      const lawyer = finalLawyerData;
      const profilePicture = lawyer.profilePicture
        ? lawyer.profilePicture.startsWith("http")
          ? lawyer.profilePicture
          : `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${lawyer.profilePicture}`
        : "/default-avatar.svg";

      const info: UserInfo = {
        id: actualUserId,
        name:
          `${lawyer.firstName || ""} ${lawyer.lastName || ""}`.trim() ||
          "Өмгөөлөгч",
        avatar: profilePicture,
        initial: lawyer.firstName?.charAt(0) || "Ө",
        userType: "lawyer",
        email: lawyer.email,
        isOnline: false, // You might want to add this to your lawyer schema
        displayName:
          `${lawyer.firstName || ""} ${lawyer.lastName || ""}`.trim() ||
          "Өмгөөлөгч", // Full name for lawyers
      };

      userInfoCache.set(actualUserId, info);
      setUserInfo(info);
      return;
    }

    // ROLE CHECK: If not a lawyer (no lawyer data found) and lawyer query is complete, try client data
    if (!finalLawyerData && !lawyerLoading && !clientLoading && !clientEmail) {
      setClientLoading(true);

      // Try to get client data from Clerk API
      fetch(`/api/users/${actualUserId}/email`)
        .then((response) => response.json())
        .then((data) => {
          if (data.email) {
            setClientEmail(data.email);
            // Store client data including profile picture
            const clientInfo: UserInfo = {
              id: actualUserId,
              name:
                data.firstName && data.lastName
                  ? `${data.firstName} ${data.lastName}`.trim()
                  : getUsernameFromEmail(data.email),
              avatar: data.profilePicture || "/default-avatar.svg",
              initial:
                data.firstName?.charAt(0) ||
                getUsernameFromEmail(data.email).charAt(0).toUpperCase(),
              userType: "client",
              email: data.email,
              displayName: getUsernameFromEmail(data.email), // Show username without @gmail.com
            };
            userInfoCache.set(actualUserId, clientInfo);
            setUserInfo(clientInfo);
          } else {
            // Fallback: generate mock email
            const mockEmail = generateMockEmailFromUserId(actualUserId);
            setClientEmail(mockEmail);
          }
        })
        .catch((error) => {
          console.error("Error fetching client data:", error);
          // Fallback: generate mock email and create client info with default avatar
          const mockEmail = generateMockEmailFromUserId(actualUserId);
          setClientEmail(mockEmail);

          const fallbackInfo: UserInfo = {
            id: actualUserId,
            name: getUsernameFromEmail(mockEmail),
            avatar: "/default-avatar.svg",
            initial: getUsernameFromEmail(mockEmail).charAt(0).toUpperCase(),
            userType: "client",
            email: mockEmail,
            displayName: getUsernameFromEmail(mockEmail), // Show username without @gmail.com
          };
          userInfoCache.set(actualUserId, fallbackInfo);
          setUserInfo(fallbackInfo);
        })
        .finally(() => {
          setClientLoading(false);
        });
    }

    // Client info is now created in the fetch callback above
  }, [
    actualUserId,
    finalLawyerData,
    clientEmail,
    clientLoading,
    lawyerLoading,
  ]);

  // If we can't extract a valid user ID, return null
  if (!actualUserId) {
    console.warn("Invalid user ID format:", userId);
    return null;
  }

  return userInfo;
}

// Helper functions are imported from useClerkUserEmail
