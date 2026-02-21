import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "bookby247 | Book Best Spas & Salons Near You",
    template: "%s | bookby247"
  },
  description: "Find and book top-rated spas, salons, and beauty services. Professional treatments at your fingertips. Over 15,000 verified businesses across 25+ cities.",
  keywords: ["spa", "salon", "beauty", "massage", "facial", "wellness", "booking", "skincare", "best spas near me", "best salons near me"],
  authors: [{ name: "bookby247 Team" }],
  creator: "bookby247",
  publisher: "bookby247",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "bookby247 | Book Best Spas & Salons Near You",
    description: "Discover and book premium beauty services at the best prices.",
    url: "https://bookby247.com",
    siteName: "bookby247",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bookby247 | Book Best Spas & Salons Near You",
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
import StructuredData from "@/components/seo/StructuredData";
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        <QueryProvider>
          <StructuredData />
          <Navbar />
          <FloatingActionButtons />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
