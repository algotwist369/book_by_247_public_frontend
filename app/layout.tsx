import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "logoname | Book Best Spas & Salons Near You",
    template: "%s | logoname"
  },
  description: "Find and book top-rated spas, salons, and beauty services. Professional treatments at your fingertips. Over 15,000 verified businesses across 25+ cities.",
  keywords: ["spa", "salon", "beauty", "massage", "facial", "wellness", "booking", "skincare", "best spas near me", "best salons near me"],
  authors: [{ name: "logoname Team" }],
  creator: "logoname",
  publisher: "logoname",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "logoname | Book Best Spas & Salons Near You",
    description: "Discover and book premium beauty services at the best prices.",
    url: "https://logoname.com",
    siteName: "logoname",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "logoname | Book Best Spas & Salons Near You",
    description: "Your ultimate beauty companion for booking spas and salons.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FloatingActionButtons } from "@/components/layout/FloatingActionButtons";
import { BottomNav } from "@/components/layout/BottomNav";
import StructuredData from "@/components/seo/StructuredData";
import QueryProvider from "@/providers/QueryProvider";
import { LazyMotion, domAnimation } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to key external origins to reduce latency */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://content.jdmagicbox.com" />
        <link rel="dns-prefetch" href="https://ui-avatars.com" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        <LazyMotion features={domAnimation}>
          <QueryProvider>
            <StructuredData />
            <Navbar />
            <FloatingActionButtons />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </QueryProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
