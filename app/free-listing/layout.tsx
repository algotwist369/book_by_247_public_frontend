import type { Metadata } from "next";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo-jsonld";

export const metadata: Metadata = {
  title: "Free Business Listing - Register Your Salon, Spa & Beauty Business - Bookby247",
  description: "Join India's premium wellness network. List your salon or spa for free, reach thousands of new customers, and manage appointments with Bookby247's professional tools.",
  keywords: [
    "free salon listing",
    "register spa business",
    "online booking software india",
    "grow beauty business",
    "business management dashboard",
    "list my salon for free",
    "spa business growth",
    "best salon website india"
  ],
  openGraph: {
    title: "Free Business Listing - Register Your Salon, Spa & Beauty Business - Bookby247",
    description: "Grow your beauty business with a free professional listing on Bookby247. Connect with customers and manage appointments effortlessly.",
    url: "https://bookby247.com/free-listing",
    siteName: "Bookby247 for Business",
    images: [
      {
        url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
        width: 1200,
        height: 630,
        alt: "Bookby247 for Business - Free Listing",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Business Listing - Bookby247 for Business",
    description: "Join India's No.1 fastest-growing wellness platform. List your salon, spa & beauty business for free today.",
    images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
  },
  alternates: {
    canonical: "/free-listing",
  },
};

export default function FreeListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "Bookby24/7 Business Portal",
                "operatingSystem": "Web",
                "applicationCategory": "BusinessApplication",
                "description": "Professional appointment management and business growth platform for salons and spas.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "1250"
                }
              },
              generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Free Listing", item: "https://bookby247.com/free-listing" },
              ]),
              generateOrganizationJsonLd(),
              generateWebSiteJsonLd()
            ]
          })
        }}
      />
      {children}
    </section>
  );
}
