import type { NextConfig } from "next";
import path from "path";

/**
 * Next.js Configuration
 * 
 * Supports two build targets:
 * 1. Web (default): Normal Next.js build for Vercel deployment
 * 2. Electron: Static export (output: 'export') for desktop app
 * 
 * Set BUILD_TARGET=electron to enable static export mode.
 */
const isElectron = process.env.BUILD_TARGET === 'electron';

const nextConfig: NextConfig = {
  // Output file tracing root to handle monorepo lockfiles
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  // Enable static export only for Electron builds
  ...(isElectron && { output: 'export' }),
  // Skip lint/ts errors during build for smooth deployment
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    // Static export requires unoptimized images (no Next.js image optimization server)
    ...(isElectron && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Security headers — only applied in web mode (static export doesn't support headers())
  ...(!isElectron && {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "SAMEORIGIN",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(self), geolocation=()",
            }
          ],
        },
      ];
    },
  }),
};

export default nextConfig;

