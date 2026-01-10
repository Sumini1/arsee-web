import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evakamnhfwqyakzckcpx.storage.supabase.co", // Fixed typo
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "evakamnhfwqyakzckcpx.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
