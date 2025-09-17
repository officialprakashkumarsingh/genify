import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force client-side rendering completely
  experimental: {
    esmExternals: 'loose',
  },
  // Ensure proper hydration
  reactStrictMode: true,
  // Disable static optimization completely
  trailingSlash: false,
  // Force dynamic rendering
  output: 'standalone',
};
