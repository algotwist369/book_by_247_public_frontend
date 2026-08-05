import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import {
  defaultOpenGraph,
  defaultTwitter,
  indexFollowRobots,
  SEO_CONFIG,
} from "@/lib/seo-config";

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  applicationName: SEO_CONFIG.brandName,
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: "%s"
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [...SEO_CONFIG.defaultKeywords],
  authors: [{ name: `${SEO_CONFIG.brandName} Team` }],
  creator: SEO_CONFIG.brandName,
  publisher: SEO_CONFIG.brandName,
  category: "spa salon wellness booking",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: defaultOpenGraph,
  twitter: defaultTwitter,
  robots: indexFollowRobots,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SEO_CONFIG.brandName,
    statusBarStyle: "black-translucent",
  },
  other: {
    "apple-mobile-web-app-title": SEO_CONFIG.brandName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: SEO_CONFIG.themeColor,
};

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FloatingActionButtons } from "@/components/layout/FloatingActionButtons";
import { BottomNav } from "@/components/layout/BottomNav";
import StructuredData from "@/components/seo/StructuredData";
import AutomaticBreadcrumbJsonLd from "@/components/seo/AutomaticBreadcrumbJsonLd";
import RouteProgress from "@/components/navigation/RouteProgress";
import Script from "next/script";
import QueryProvider from "@/providers/QueryProvider";
import UtmTracker from "@/components/analytics/UtmTracker";
import { BlogAuthProvider } from "@/hooks/useBlogAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="-bpy02NcWgpZGZ989qJTsr3-SDJzSCN0oCDJfKm-Hvs" />
        <meta name="msvalidate.01" content="4DF60793F804FED7D277DF0F7E14BE23" />
        {/* Preconnect to key external origins to reduce latency */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://content.jdmagicbox.com" />
        <link rel="dns-prefetch" href="https://ui-avatars.com" />
        <link rel="preload" as="image" href={SEO_CONFIG.ogImage.url} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="BookBy247 LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="BookBy247 expanded LLM context" />
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
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {process.env.NEXT_PUBLIC_GTM_ID && process.env.NEXT_PUBLIC_GTM_ID.startsWith('GTM-') && (
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

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xxnefzjoqf");
          `}
        </Script>

        <QueryProvider>
          <BlogAuthProvider>
            <Suspense fallback={null}>
              <UtmTracker />
            </Suspense>
            <StructuredData />
            <AutomaticBreadcrumbJsonLd />
            <RouteProgress />
            <Navbar />
            <FloatingActionButtons />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </BlogAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
