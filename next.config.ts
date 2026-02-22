import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any HTTPS source — needed because business images
    // are scraped from a wide variety of third-party domains (JustDial,
    // Cloudinary, Google, Unsplash, etc.) that can't all be whitelisted.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
