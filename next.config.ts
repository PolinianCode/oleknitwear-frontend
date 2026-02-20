import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.ole-knitwear.com",
      },
    ],
  },
};

export default nextConfig;
