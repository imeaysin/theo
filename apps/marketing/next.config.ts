import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/auth"],
  images: {
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.midday.ai",
      },
    ],
  },
}

export default nextConfig
