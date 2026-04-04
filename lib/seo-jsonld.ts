import { PublicBusiness } from "@/api/public/business";

export const generateLocalBusinessJsonLd = (business: any) => {
  const slug = business.slug || business.bussiness_slug;
  const baseUrl = "https://bookby247.com";
  
  return {
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/business/${slug}#business`,
    "name": business.name || business.business_title,
    "description": business.description || business.business_dec,
    "image": [
      business.images?.banner,
      ...(business.images?.gallery || []),
      business.images?.logo,
      business.images?.thumbnail,
    ].filter(Boolean),
    "url": `${baseUrl}/business/${slug}`,
    "telephone": business.phone || business.business_contacts,
    "address": business.address
      ? {
          "@type": "PostalAddress",
          "streetAddress": business.address,
          "addressLocality": business.branch || business.city || business.business_location?.split(",")[0],
          "addressRegion": business.state,
          "postalCode": business.pincode,
          "addressCountry": "IN",
        }
      : undefined,
    "aggregateRating": business.ratings?.average || business.business_avg_tating
      ? {
          "@type": "AggregateRating",
          "ratingValue": business.ratings?.average || business.business_avg_tating,
          "reviewCount": business.ratings?.totalReviews || business.business_reviws_len,
        }
      : undefined,
    "geo": business.location?.coordinates
      ? {
          "@type": "GeoCoordinates",
          "latitude": business.location.coordinates[1],
          "longitude": business.location.coordinates[0],
        }
      : undefined,
    "priceRange": business.searchProfile?.priceCategory === "luxury" ? "$$$" : business.searchProfile?.priceCategory === "mid" ? "$$" : "$",
  };
};

export const generateBreadcrumbJsonLd = (items: { name: string; item: string }[]) => {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item,
    })),
  };
};

export const generateItemListJsonLd = (businesses: any[], city?: string, service?: string) => {
  const baseUrl = "https://bookby247.com";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${service || "Spas and Salons"} in ${city || "India"}`,
    "description": `List of top-rated ${service || "beauty services"} available in ${city || "your area"}.`,
    "url": `${baseUrl}/search/${city || ""}/${service || ""}`,
    "itemListElement": businesses.map((business, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": generateLocalBusinessJsonLd(business)
    })),
  };
};

export const generateOrganizationJsonLd = () => {
  return {
    "@type": "Organization",
    "name": "Bookby247",
    "url": "https://bookby247.com",
    "logo": "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
    "sameAs": [
      "https://www.facebook.com/bookby247",
      "https://www.instagram.com/bookby247",
      "https://twitter.com/bookby247"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service"
    }
  };
};
