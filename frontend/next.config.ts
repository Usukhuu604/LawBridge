import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    NEXT_PUBLIC_R2_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c16a65dfb75c4bf1b7d1984fa8323c49.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
