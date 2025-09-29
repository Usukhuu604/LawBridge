import { useUser } from "@clerk/nextjs";
import { getUserDisplayName, getUserInitials } from "@/lib/userUtils";

interface UserData {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  initials: string;
  isLawyer: boolean;
}

export function useUserData(userId?: string): UserData | null {
  const { user } = useUser();

  // If this is the current user, return their data
  if (user && userId && userId === user.id) {
    return {
      id: user.id,
      name: getUserDisplayName(user),
      email: user.emailAddresses?.[0]?.emailAddress,
      avatar: user.imageUrl,
      initials: getUserInitials(user),
      isLawyer: false, // Current user is not a lawyer in this context
    };
  }

  // For other users, we can't fetch their data directly from Clerk
  // This would need to be handled by your backend
  return null;
}

/**
 * Extract meaningful name from Clerk user ID
 * @param clerkUserId - Clerk user ID like "user_325Yas52wp9FZh5n3imoCTTtroi"
 * @returns A more readable name
 */
export function extractNameFromClerkId(clerkUserId: string): string {
  if (!clerkUserId) return "User";

  // Remove "user_" prefix if present
  const cleanId = clerkUserId.replace(/^user_/, "");

  // Take the first 8 characters and make them more readable
  const readablePart = cleanId.slice(0, 8);

  // Convert to a more readable format
  return readablePart.replace(/([A-Z])/g, " $1").trim() || readablePart;
}

/**
 * Get initials from Clerk user ID
 * @param clerkUserId - Clerk user ID
 * @returns Initials string
 */
export function getInitialsFromClerkId(clerkUserId: string): string {
  if (!clerkUserId) return "U";

  // Remove "user_" prefix if present
  const cleanId = clerkUserId.replace(/^user_/, "");

  // Take first character
  return cleanId.charAt(0).toUpperCase();
}
