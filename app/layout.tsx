import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "bookby247 | Book Best Spas & Salons Near You",
    template: "%s | bookby247"
  },
  metadataBase: new URL("https://bookby247.com"),
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
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FloatingActionButtons } from "@/components/layout/FloatingActionButtons";
import { BottomNav } from "@/components/layout/BottomNav";
import StructuredData from "@/components/seo/StructuredData";
import Script from "next/script";
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}

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
