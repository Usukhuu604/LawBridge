import mongoose from "mongoose";

export const connectDatabase = async () => {
  const url = process.env.MONGODB_CONNECTION_URL;

  if (!url) {
    throw new Error(
      "❌ MONGODB_CONNECTION_URL not found in environment variables"
    );
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url, {
        dbName: "LawBridge", // шаардлагатай бол
      });
      console.log("✅ MongoDB connected successfully");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // optionally crash the process if DB is critical
  }
};
