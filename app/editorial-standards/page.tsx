import type { Metadata } from "next";
import { generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Editorial Standards & AI Content Policy | Bookby247",
  description:
    "Learn how Bookby247 creates, reviews, and updates spa, salon, beauty, wellness, and business-management content for accuracy, usefulness, and transparency.",
  alternates: {
    canonical: "/editorial-standards",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Bookby247 Editorial Standards & AI Content Policy",
    description:
      "How Bookby247 keeps public wellness, booking, business listing, and educational content accurate, useful, and people-first.",
    url: "https://bookby247.com/editorial-standards",
    siteName: "Bookby247",
    type: "website",
    locale: "en_IN",
  },
};

const standards = [
  {
    title: "People-first usefulness",
    content:
      "Bookby247 content is written to help customers compare and book spas, salons, massage centers, beauty parlours, grooming services, and wellness businesses with clarity.",
  },
  {
    title: "Accuracy and business data",
    content:
      "Business names, locations, services, prices, opening hours, contact details, reviews, and booking details are sourced from listed businesses, platform records, customer interactions, and public business information where available.",
  },
  {
    title: "AI-assisted workflows",
    content:
      "Bookby247 may use AI-assisted tools to organize drafts, summarize public information, improve structure, generate internal research outlines, or support visual concepts. AI assistance is not treated as a replacement for human review where accuracy matters.",
  },
  {
    title: "Human review and updates",
    content:
      "Important public pages, business profiles, booking flows, and SEO content are reviewed and updated to reduce outdated, duplicated, misleading, or low-value information.",
  },
  {
    title: "No mass low-value pages",
    content:
      "Bookby247 avoids creating pages only to capture keyword variations. Local, service, blog, and business pages should provide real discovery, comparison, booking, or educational value.",
  },
  {
    title: "Images and media",
    content:
      "Images are intended to support nearby text and user decisions. Business images may come from owners, public sources, or platform-created assets, with descriptive alt text wherever practical.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://bookby247.com/editorial-standards#webpage",
      "url": "https://bookby247.com/editorial-standards",
      "name": "Bookby247 Editorial Standards & AI Content Policy",
      "description":
        "Bookby247 explains how spa, salon, beauty, wellness, business listing, and educational content is created, reviewed, updated, and assisted by AI tools.",
      "isPartOf": {
        "@id": "https://bookby247.com/#website",
      },
      "publisher": {
        "@id": "https://bookby247.com/#organization",
      },
      "about": [
        "Editorial standards",
        "AI-assisted content",
        "Spa and salon booking",
        "Beauty and wellness business listings",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://bookby247.com/editorial-standards#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does Bookby247 use AI-generated content?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bookby247 may use AI-assisted tools for drafting support, structure, summaries, research organization, or visual concepts, but important public information is reviewed for usefulness and accuracy.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Bookby247 keep business information accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bookby247 uses listed business data, platform records, customer interactions, and public business information where available, then updates pages when information changes or issues are reported.",
          },
        },
        {
          "@type": "Question",
          "name": "Does Bookby247 create pages only for search engines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Bookby247 aims to create local, service, business, and educational pages that help users discover, compare, book, or understand spa, salon, beauty, and wellness services.",
          },
        },
      ],
    },
    generateBreadcrumbJsonLd([
      { name: "Home", item: "https://bookby247.com/" },
      { name: "Editorial Standards", item: "https://bookby247.com/editorial-standards" },
    ]),
    generateOrganizationJsonLd(),
    generateWebSiteJsonLd(),
  ],
};

export default function EditorialStandardsPage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-600">
            Trust & transparency
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            Editorial Standards & AI Content Policy
          </h1>
          <p className="mt-5 text-base leading-8 text-zinc-600">
            Bookby247 publishes public information for customers searching for spas, salons,
            massage centers, beauty parlours, grooming services, wellness experiences, and
            business-management tools. This page explains how we keep that content useful,
            accurate, and transparent.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {standards.map((item) => (
            <article key={item.title} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <h2 className="text-lg font-black text-zinc-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{item.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
          <h2 className="text-xl font-black">Report outdated or incorrect information</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
            If a business profile, service, article, image, price, contact detail, or booking
            detail appears outdated or inaccurate, contact us at{" "}
            <a className="font-bold text-white underline underline-offset-4" href="mailto:support@bookby247.com">
              support@bookby247.com
            </a>
            . We review reported issues and update content where needed.
          </p>
        </div>
      </section>
    </main>
  );
}
