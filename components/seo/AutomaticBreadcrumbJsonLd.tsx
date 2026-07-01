"use client";

import { usePathname } from "next/navigation";
import { SEO_CONFIG } from "@/lib/seo-config";
import { safeJsonLdStringify } from "@/lib/utils";

const titleFromSegment = (segment: string) =>
  decodeURIComponent(segment)
    .replace(/\[[^\]]+\]/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

export default function AutomaticBreadcrumbJsonLd() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${SEO_CONFIG.baseUrl}/`,
    },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        "@type": "ListItem",
        "position": index + 2,
        "name": titleFromSegment(segment),
        "item": `${SEO_CONFIG.baseUrl}${href}`,
      };
    }),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
