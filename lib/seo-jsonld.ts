type SeoValue = string | number;

type BusinessServiceOption = {
  price?: SeoValue;
  duration?: SeoValue;
};

type BusinessService = {
  name?: string;
  service_title?: string;
  shortDescription?: string;
  description?: string;
  service_description?: string;
  pricingOptions?: BusinessServiceOption[];
  business?: string | {
    name?: string;
    slug?: string;
  };
  minPrice?: SeoValue;
  service_min_price?: SeoValue;
  maxPrice?: SeoValue;
  service_max_price?: SeoValue;
  rating?: SeoValue;
  service_avg_rating?: SeoValue;
  reviewsCount?: SeoValue;
  service_reviews_count?: SeoValue;
};

type BusinessJsonLdInput = {
  slug?: string;
  bussiness_slug?: string;
  workingHours?: {
    working_hours?: {
      days?: string[];
      open?: string;
      close?: string;
    };
    open?: string;
    close?: string;
  };
  images?: string[];
  name?: string;
  business_title?: string;
  description?: string;
  business_dec?: string;
  phone?: string;
  business_contacts?: string;
  email?: string;
  address?: string;
  city?: string;
  branch?: string;
  business_location?: string;
  state?: string;
  zip_code?: string;
  pincode?: string;
  ratings?: {
    average?: SeoValue;
    totalReviews?: SeoValue;
    total_reviews?: SeoValue;
  };
  avg_rating?: SeoValue;
  business_avg_tating?: SeoValue;
  total_reviews?: SeoValue;
  business_reviws_len?: SeoValue;
  location?: {
    coordinates?: SeoValue[];
  };
  locationInfo?: {
    coordinates?: {
      lat?: SeoValue;
      lng?: SeoValue;
    };
  };
  searchProfile?: {
    priceCategory?: string;
  };
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  amenities?: string[];
  services?: BusinessService[];
};

const getServiceBusiness = (business: BusinessService["business"]) =>
  typeof business === "object" && business !== null ? business : undefined;

export const generateLocalBusinessJsonLd = (business: BusinessJsonLdInput) => {
  const slug = business.slug || business.bussiness_slug;
  const baseUrl = "https://bookby247.com";
  const workingHours = business.workingHours;
  const workingHoursDetails = workingHours?.working_hours;

  // Map working hours to Schema.org format
  const openingHoursSpecification = workingHoursDetails?.days?.map((day: string) => ({
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
    "opens": workingHoursDetails.open || workingHours?.open,
    "closes": workingHoursDetails.close || workingHours?.close
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

export const generateServiceItemListJsonLd = (business: BusinessJsonLdInput) => {
  const services = business.services || [];

  return {
    "@type": "ItemList",
    "name": `Services at ${business.name}`,
    "numberOfItems": services.length,
    "itemListElement": services.map((service, index) => ({
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
        "offers": service.pricingOptions?.map((option) => ({
            "@type": "Offer",
            "price": option.price,
            "priceCurrency": "INR",
            "description": `${option.duration} minutes service`
        }))
      }
    }))
  };
};

export const generateGlobalServiceItemListJsonLd = (services: BusinessService[], city?: string, category?: string) => {
    const baseUrl = "https://bookby247.com";
    return {
      "@type": "ItemList",
      "name": `${category || "Services"} in ${city || "India"}`,
      "description": `Compare prices and reviews for ${category || "wellness services"} in ${city || "your area"}.`,
      "numberOfItems": services.length,
      "itemListElement": services.map((service, index) => {
        const serviceBusiness = getServiceBusiness(service.business);

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Service",
            "name": service.name || service.service_title,
            "description": service.shortDescription || service.description || service.service_description,
            "provider": {
              "@type": "LocalBusiness",
              "name": serviceBusiness?.name,
              "url": `${baseUrl}/business/${serviceBusiness?.slug}`
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
        };
      }),
    };
  };

export const generateItemListJsonLd = (businesses: BusinessJsonLdInput[], city?: string, service?: string) => {
  const baseUrl = "https://bookby247.com";
  return {
    "@type": "ItemList",
    "name": `${service || "Spas and Salons"} in ${city || "India"}`,
    "description": `List of top-rated ${service || "spa, salon, massage, hair, skincare and beauty services"} available in ${city || "your area"}.`,
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
    "alternateName": "Book by 24/7",
    "url": "https://bookby247.com",
    "logo": "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
    "description": "Bookby247 helps users in India discover and book verified spas, salons, beauty parlours, massage centers, hair salons, skincare studios, nail salons, grooming services and makeup artists with price comparison and verified reviews.",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "knowsAbout": [
      "Spa Services",
      "Salon Appointments",
      "Beauty Treatments",
      "Massage Therapy",
      "Full Body Massage",
      "Hair Styling",
      "Skincare",
      "Facials",
      "Bridal Makeup",
      "Waxing",
      "Threading",
      "Manicure",
      "Pedicure",
      "Wellness Booking",
      "Spa Management Software",
      "Salon Management Software",
      "Multi Branch Management",
      "Appointment Management",
      "Customer CRM",
      "Inventory Management",
      "Campaign Management",
      "Billing and Finance Management"
    ],
    "sameAs": [
      "https://www.facebook.com/bookby247",
      "https://www.instagram.com/bookby247",
      "https://twitter.com/bookby247"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8542153652",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi", "Marathi"]
    }
  };
};

export const generateWebSiteJsonLd = () => {
  return {
    "@type": "WebSite",
    "name": "Bookby247",
    "url": "https://bookby247.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bookby247.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateSeoTagsItemListJsonLd = (tags: { slug: string; name: string; seo: { title: string; description: string } }[]) => {
  const baseUrl = "https://bookby247.com";
  return {
    "@type": "ItemList",
    "name": "Popular Wellness Tags",
    "description": "Explore popular wellness and beauty service tags on Bookby247",
    "url": baseUrl,
    "itemListElement": tags.map((tag, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
        "description": tag.seo.description,
        "url": `${baseUrl}/search?tag=${encodeURIComponent(tag.slug)}`
      }
    }))
  };
};
