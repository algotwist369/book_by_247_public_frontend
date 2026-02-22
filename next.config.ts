import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Target modern browsers to reduce legacy JS polyfills
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  images: {
    // Allow images from any HTTPS source — needed because business images
    // are scraped from a wide variety of third-party domains (JustDial,
    // Cloudinary, Google, Unsplash, etc.) that can't all be whitelisted.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Serve modern formats for browsers that support them
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
  },

  // Add cache-control headers to maximize browser caching and cut latency
  async headers() {
    return [
      {
        // Static assets (JS/CSS/images) — immutable for 1 year
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js image optimization endpoint — cache for 1 day
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Pages with ISR — stale-while-revalidate
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
