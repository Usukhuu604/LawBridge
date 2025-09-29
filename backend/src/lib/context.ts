import type { Request } from "express";
import type { Context } from "@/types/context";
import mongoose from "mongoose";
import { createClerkClient, verifyToken } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export const buildContext = async (req: Request): Promise<Context> => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  let userId: string | undefined;
  let clientId: string | undefined;
  let lawyerId: string | undefined;
  let username: string | undefined;
  let role: string | undefined;

  if (token) {
    try {
      // const { sub } = await verifyToken(token, {
      //   secretKey: process.env.CLERK_SECRET_KEY!,
      // });

      userId = token;
      const user = await clerkClient.users.getUser(userId);

      role = user.publicMetadata?.role as string;
      username = user.publicMetadata?.username as string;

      console.log("👤 Verified Clerk User ID:", userId);
      console.log("📛 Username:", username);
      console.log("🧑‍⚖️ Role:", role);

      if (!role) {
        console.warn("❓ Unknown or missing role in metadata.");
      }

      if (role === "user") {
        clientId = userId;
      } else if (role === "lawyer") {
        lawyerId = userId;
      }
    } catch (err) {
      console.error("❌ Token verification failed:", err);
    }
  }

  return {
    req,
    db: mongoose.connection.db,
    userId,
    clientId,
    lawyerId,
    username,
    role,
    io: req.app.get("io"),
  };
};
