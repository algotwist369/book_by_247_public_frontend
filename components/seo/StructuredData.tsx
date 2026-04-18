import React from "react";
import { safeJsonLdStringify } from "@/lib/utils";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "Bookby247",
                "alternateName": "Book by 24/7",
                "url": "https://bookby247.com",
                "logo": "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
                "description": "Bookby247 is India's premier beauty and wellness booking platform, connecting users with top-rated spas, salons, and beauty professionals for instant appointment booking.",
                "areaServed": {
                    "@type": "Country",
                    "name": "India"
                },
                "knowsAbout": [
                    "Spa Services",
                    "Salon Appointments",
                    "Beauty Treatments",
                    "Massage Therapy",
                    "Wellness Booking"
                ],
                "sameAs": [
                    "https://www.facebook.com/bookby247",
                    "https://www.instagram.com/bookby247",
                    "https://twitter.com/bookby247",
                    "https://www.linkedin.com/company/bookby247"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-8542153652",
                    "contactType": "customer service",
                    "availableLanguage": ["English", "Hindi"]
                }
            },
            {
                "@type": "WebSite",
                "name": "Bookby247",
                "url": "https://bookby247.com",
                "description": "Book best spas, salons, and wellness services near you with Bookby247.",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://bookby247.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
        />
    );
};

export default StructuredData;
