import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["backyard-ultra-tracker.bmcfads.dev"],
    },
  },
};

export default nextConfig;
