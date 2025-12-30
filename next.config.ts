import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  devIndicators: false,
  images: {
    domains: [
      "https://evakamnhfwqyakzckcpx.storage.supabase.co",
      "https://evakamnhfwqyakzckcpx.supabase.co",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "evakamnhfwqyakzckcpx.storagesupabase.co",
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
