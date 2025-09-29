import { useState, useEffect } from "react";

interface ClerkUserEmail {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

// Cache to store fetched user data
const userEmailCache = new Map<string, ClerkUserEmail>();

// Helper function to generate mock email from user ID
export function generateMockEmailFromUserId(userId: string): string {
  if (!userId) return "user@example.com";

  // Remove "user_" prefix if present
  const cleanId = userId.replace(/^user_/, "");

  // Take first 8 characters and make it more readable
  const readablePart = cleanId.slice(0, 8);

  // Convert to a more readable format
  const username = readablePart
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  return `${username}@example.com`;
}

export function useClerkUserEmail(userId: string): ClerkUserEmail | null {
  const [userData, setUserData] = useState<ClerkUserEmail | null>(null);
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Check cache first
    if (userEmailCache.has(userId)) {
      setUserData(userEmailCache.get(userId)!);
      return;
    }

    // Fetch from Clerk API
    const fetchUserEmail = async () => {
      setLoading(true);
      try {
        console.log("useClerkUserEmail: Fetching email for userId:", userId);

        // Try to call the API first
        const response = await fetch(`/api/users/${userId}/email`);
        console.log("useClerkUserEmail: Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("useClerkUserEmail: Received data:", data);
          const userInfo: ClerkUserEmail = {
            userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            profilePicture: data.profilePicture,
          };

          // Cache the result
          userEmailCache.set(userId, userInfo);
          setUserData(userInfo);
        } else {
          // Fallback: Create a mock email based on the user ID
          console.log("useClerkUserEmail: API failed, using fallback");
          const mockEmail = generateMockEmailFromUserId(userId);
          const userInfo: ClerkUserEmail = {
            userId,
            email: mockEmail,
            firstName: undefined,
            lastName: undefined,
            profilePicture: undefined,
          };

          // Cache the result
          userEmailCache.set(userId, userInfo);
          setUserData(userInfo);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
        // Fallback: Create a mock email based on the user ID
        const mockEmail = generateMockEmailFromUserId(userId);
        const userInfo: ClerkUserEmail = {
          userId,
          email: mockEmail,
          firstName: undefined,
          lastName: undefined,
          profilePicture: undefined,
        };

        // Cache the result
        userEmailCache.set(userId, userInfo);
        setUserData(userInfo);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, [userId]);

  return userData;
}

// Helper function to extract username from email
export function getUsernameFromEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return "User";
  }
  return email.split("@")[0];
}

// Helper function to get initials from email
export function getInitialsFromEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return "U";
  }
  const username = email.split("@")[0];
  return username.charAt(0).toUpperCase();
}
