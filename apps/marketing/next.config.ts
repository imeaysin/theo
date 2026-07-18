import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@workspace/ui-shadcn"],
}

export default nextConfig
