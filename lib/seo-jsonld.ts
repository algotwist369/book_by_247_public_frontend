import { PublicBusiness } from "@/api/public/business";

export const generateLocalBusinessJsonLd = (business: any) => {
  const slug = business.slug || business.bussiness_slug;
  const baseUrl = "https://bookby247.com";

  // Map working hours to Schema.org format
  const openingHoursSpecification = business.workingHours?.working_hours?.days?.map((day: string) => ({
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
    "opens": business.workingHours.working_hours.open || business.workingHours.open,
    "closes": business.workingHours.working_hours.close || business.workingHours.close
  })) || [];

  const images = Array.isArray(business.images) ? business.images : [];

  return {
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/business/${slug}#business`,
    "name": business.name || business.business_title,
    "description": business.description || business.business_dec,
    "image": images.length > 0 ? images : ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
    "url": `${baseUrl}/business/${slug}`,
    "telephone": business.phone || business.business_contacts,
    "email": business.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address || "",
      "addressLocality": business.city || business.branch || business.business_location?.split(",")[0],
      "addressRegion": business.state || "",
      "postalCode": business.zip_code || business.pincode || "",
      "addressCountry": "IN",
    },
    "aggregateRating": (business.ratings?.average || business.avg_rating || business.business_avg_tating)
      ? {
        "@type": "AggregateRating",
        "ratingValue": business.ratings?.average || business.avg_rating || business.business_avg_tating,
        "reviewCount": business.ratings?.totalReviews || business.total_reviews || business.business_reviws_len,
        "bestRating": "5",
        "worstRating": "1"
      }
      : undefined,
    "geo": (business.location?.coordinates || business.locationInfo?.coordinates)
      ? {
        "@type": "GeoCoordinates",
        "latitude": business.location?.coordinates?.[1] || business.locationInfo?.coordinates?.lat,
        "longitude": business.location?.coordinates?.[0] || business.locationInfo?.coordinates?.lng,
      }
      : undefined,
    "openingHoursSpecification": openingHoursSpecification,
    "priceRange": business.searchProfile?.priceCategory === "luxury" ? "$$$" : business.searchProfile?.priceCategory === "mid" ? "$$" : "$",
    "sameAs": [
      business.facebook,
      business.instagram,
      business.twitter,
      business.linkedin,
      business.youtube,
    ].filter(Boolean),
    "amenityFeature": business.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    }))
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

export const generateServiceItemListJsonLd = (business: any) => {
  const services = business.services || [];
  const baseUrl = "https://bookby247.com";

  return {
    "@type": "ItemList",
    "name": `Services at ${business.name}`,
    "numberOfItems": services.length,
    "itemListElement": services.map((service: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.name,
        "description": service.shortDescription || service.description,
        "provider": {
          "@type": "LocalBusiness",
          "name": business.name
        },
        "offers": service.pricingOptions?.map((option: any) => ({
            "@type": "Offer",
            "price": option.price,
            "priceCurrency": "INR",
            "description": `${option.duration} minutes service`
        }))
      }
    }))
  };
};

export const generateGlobalServiceItemListJsonLd = (services: any[], city?: string, category?: string) => {
    const baseUrl = "https://bookby247.com";
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${category || "Services"} in ${city || "India"}`,
      "description": `Compare prices and reviews for ${category || "wellness services"} in ${city || "your area"}.`,
      "numberOfItems": services.length,
      "itemListElement": services.map((service: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": service.name || service.service_title,
          "description": service.shortDescription || service.description || service.service_description,
          "provider": {
            "@type": "LocalBusiness",
            "name": service.business?.name,
            "url": `${baseUrl}/business/${service.business?.slug}`
          },
          "offers": {
              "@type": "AggregateOffer",
              "lowPrice": service.minPrice || service.service_min_price,
              "highPrice": service.maxPrice || service.service_max_price,
              "priceCurrency": "INR"
          },
          "aggregateRating": service.rating || service.service_avg_rating ? {
              "@type": "AggregateRating",
              "ratingValue": service.rating || service.service_avg_rating,
              "reviewCount": service.reviewsCount || service.service_reviews_count,
              "bestRating": "5",
              "worstRating": "1"
          } : undefined
        }
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
      "telephone": "+91-8542153652",
      "contactType": "customer service"
    }
  };
};
