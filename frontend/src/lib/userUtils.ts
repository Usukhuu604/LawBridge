/**
 * Extract username from email address
 * @param email - The email address
 * @returns The username part before @
 */
export function getUsernameFromEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return email || "User";
  }
  return email.split("@")[0];
}

/**
 * Get user display name from various sources
 * @param user - User object with potential name/email
 * @returns Display name for the user
 */
export function getUserDisplayName(user: {
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses?: Array<{ emailAddress: string }>;
  email?: string;
}): string {
  // Try to get full name first
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  if (user.firstName) {
    return user.firstName;
  }

  // Fallback to email username
  const email = user.emailAddresses?.[0]?.emailAddress || user.email;
  if (email) {
    return getUsernameFromEmail(email);
  }

  return "User";
}

/**
 * Get user initials for avatar
 * @param user - User object
 * @returns Initials string
 */
export function getUserInitials(user: {
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses?: Array<{ emailAddress: string }>;
  email?: string;
}): string {
  // Try to get initials from name
  if (user.firstName) {
    const firstInitial = user.firstName.charAt(0).toUpperCase();
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || "";
    return (firstInitial + lastInitial).trim();
  }

  // Fallback to email username initials
  const email = user.emailAddresses?.[0]?.emailAddress || user.email;
  if (email) {
    const username = getUsernameFromEmail(email);
    return username.charAt(0).toUpperCase();
  }

  return "U";
}
