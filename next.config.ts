import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization for interactive components
  experimental: {
    // Force client-side rendering
    esmExternals: 'loose',
  },
  // Ensure proper hydration
  reactStrictMode: true,
  // Force dynamic rendering
  output: 'standalone',
};
