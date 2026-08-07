import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Target modern imports to reduce bundle overhead
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-icons"],
  },

  images: {
    // Allow images from any HTTPS source
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
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Add cache-control and security headers to maximize score & safety
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const csp = (isProd
      ? "default-src 'self' https: data: blob:; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://maps.googleapis.com https://www.clarity.ms https://*.clarity.ms; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob: res.cloudinary.com images.unsplash.com lh3.googleusercontent.com; font-src 'self' https: data:; connect-src 'self' https: wss: https://cloudflareinsights.com https://maps.googleapis.com https://*.clarity.ms http://localhost:9009 http://localhost:9004 http://127.0.0.1:9004; frame-src 'self' https:;"
      : "default-src 'self' https: data: blob:; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://maps.googleapis.com https://www.clarity.ms https://*.clarity.ms; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob: res.cloudinary.com images.unsplash.com lh3.googleusercontent.com; font-src 'self' https: data:; connect-src 'self' https: wss: https://cloudflareinsights.com https://maps.googleapis.com https://*.clarity.ms http://localhost:9009 http://localhost:9004 http://127.0.0.1:9004; frame-src 'self' https:;"
    ).replace(/\s{2,}/g, " ").trim();

    return [
      {
        // Static assets (JS/CSS/images) - immutable for 1 year
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js image optimization endpoint - cache for 1 day
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Private, auth and API surfaces should never be indexed
        source: "/:privatePath(admin|dashboard|auth|login|register|api|booking-status)/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        // Global Pages
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
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(), microphone=()",
          },
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
