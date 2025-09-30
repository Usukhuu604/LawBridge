import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate userId format (Clerk user IDs typically start with 'user_')
    if (!userId.startsWith("user_")) {
      console.warn("Invalid user ID format:", userId);
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Check if Clerk secret key is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Clerk not configured" },
        { status: 500 }
      );
    }

    // Create Clerk client
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Get user data from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract email and other info
    const emailAddress = user.emailAddresses[0]?.emailAddress;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const profilePicture = user.imageUrl;

    if (!emailAddress) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: emailAddress,
      firstName,
      lastName,
      profilePicture,
    });
  } catch (error) {
    console.error("Error fetching user email:", error);

    // More specific error handling
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });

      // Handle specific Clerk errors
      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (
        error.message.includes("unauthorized") ||
        error.message.includes("401")
      ) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to fetch user data",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
