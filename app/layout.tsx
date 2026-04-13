import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookby247.com"),
  title: {
    default: "Bookby247 - Discover & Book Top Spas, Salons and Beauty Services Near You",
    template: "%s - Bookby247"
  },
  description: "Book & discover top-rated spas, salons, and beauty services across India Near You. Explore verified businesses, compare services, check reviews, and book appointments online with Bookby247.",
  keywords: [
    "spa booking",
    "salon booking",
    "beauty services",
    "spa near me",
    "salon near me",
    "massage spa",
    "facial services",
    "wellness center",
    "beauty parlour",
    "spa in Mumbai",
    "best spa",
    "salon in Mumbai",
    "beauty services India",
    "book spa online",
    "book salon online",

    "spa booking online",
    "salon appointment booking",
    "book massage near me",
    "instant salon booking",
    "online beauty service booking",
    "same day spa booking",
    "book facial appointment",
    "hair salon appointment near me",
    "spa reservation system",
    "salon booking app",

    "best spa in Mumbai",
    "best salon in Navi Mumbai",
    "spa near Vashi",
    "salon near Andheri",
    "spa near me open now",
    "salon open now near me",
    "affordable spa in Mumbai",
    "luxury spa Mumbai",
    "unisex salon near me",
    "ladies beauty parlour near me",

    "full body massage near me",
    "deep tissue massage Mumbai",
    "aromatherapy spa",
    "couple spa near me",
    "thai massage near me",
    "ayurvedic spa treatment",

    "haircut near me",
    "hair spa treatment",
    "hair smoothening salon",
    "keratin treatment near me",
    "beard grooming salon",

    "facial near me",
    "bridal makeup artist",
    "cleanup facial services",
    "skin care clinic near me",
    "acne treatment facial",

    "spa offers near me",
    "salon discount deals",
    "cheap spa near me",
    "affordable salon services",
    "spa packages Mumbai",
    "bridal package salon",
    "membership spa deals",

    "spa management software",
    "salon management system",
    "booking CRM for salon",
    "spa appointment software",
    "salon POS system",
    "beauty salon CRM",
    "appointment scheduling software",
    "booking management dashboard",
    "salon business software India",

    "AI salon booking system",
    "smart appointment scheduler",
    "automated booking system",
    "WhatsApp booking salon",
    "QR check-in salon",
    "contactless spa booking",
    "mobile salon booking app",
    "real-time booking system",

    "where can I book a spa near me",
    "best salon near me open now",
    "cheap massage spa near me",
    "which salon is best in Mumbai",
    "book facial appointment near me",

    "spa booking",
    "salon booking",
    "beauty services",
    "spa near me",
    "salon near me",
    "massage spa",
    "facial services",
    "wellness center",
    "beauty parlour",
    "spa in India",
    "salon in India",
    "beauty services India",
    "book spa online",
    "book salon online",

    "spa booking online",
    "salon appointment booking",
    "book massage near me",
    "instant salon booking",
    "online beauty service booking",
    "same day spa booking",
    "book facial appointment",
    "hair salon appointment near me",
    "spa reservation system",
    "salon booking app",

    "best spa in India",
    "best salon near me",
    "spa near me open now",
    "salon open now near me",
    "affordable spa near me",
    "luxury spa near me",
    "unisex salon near me",
    "ladies beauty parlour near me",
    "top rated salon near me",
    "best beauty parlour in India",

    "full body massage near me",
    "deep tissue massage near me",
    "aromatherapy spa",
    "couple spa near me",
    "thai massage near me",
    "ayurvedic spa treatment",
    "body massage center near me",
    "relaxation spa near me",

    "haircut near me",
    "hair spa treatment",
    "hair smoothening salon",
    "keratin treatment near me",
    "beard grooming salon",
    "hair styling salon near me",
    "professional hair salon",
    "men salon near me",

    "facial near me",
    "bridal makeup artist",
    "cleanup facial services",
    "skin care clinic near me",
    "acne treatment facial",
    "glow facial services",
    "beauty salon for women",
    "makeup artist near me",

    "spa offers near me",
    "salon discount deals",
    "cheap spa near me",
    "affordable salon services",
    "spa packages near me",
    "bridal package salon",
    "membership spa deals",
    "discount salon near me",

    "spa management software",
    "salon management system",
    "booking CRM for salon",
    "spa appointment software",
    "salon POS system",
    "beauty salon CRM",
    "appointment scheduling software",
    "booking management dashboard",
    "salon business software India",

    "AI salon booking system",
    "smart appointment scheduler",
    "automated booking system",
    "WhatsApp booking salon",
    "QR check-in salon",
    "contactless spa booking",
    "mobile salon booking app",
    "real-time booking system",

    "where can I book a spa near me",
    "best salon near me open now",
    "cheap massage spa near me",
    "which salon is best in India",
    "book facial appointment near me",
    "nearest beauty parlour",
    "spa services near me",
    "salon services near me"
  ],
  authors: [{ name: "Bookby247 Team" }],
  creator: "Bookby247",
  publisher: "Bookby247",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Discover & Book Top Spas, Salons and Beauty Services Near You - Bookby247",
    description:
      "Find verified spas, salons, and beauty services near you. Compare reviews, explore services, and book appointments online.",
    url: "https://bookby247.com",
    siteName: "Bookby247",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
        width: 1200,
        height: 630,
        alt: "Bookby247 - Spa, Salon and Beauty Booking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover & Book Top Spas, Salons and Beauty Services Near You - Bookby247",
    description:
      "Explore trusted spas, salons, and beauty businesses near you with Bookby247.",
    images: [
      "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
    ],
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
    icon: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
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
        <meta name="google-site-verification" content="-bpy02NcWgpZGZ989qJTsr3-SDJzSCN0oCDJfKm-Hvs" />
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
      </body>
    </html>
  );
}
