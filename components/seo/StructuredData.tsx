import React from "react";
import { safeJsonLdStringify } from "@/lib/utils";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://bookby247.com/#organization",
                "name": "Bookby247",
                "alternateName": "Book by 24/7",
                "url": "https://bookby247.com",
                "logo": "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
                "description": "Bookby247 helps users in India find and book verified spas, salons, beauty parlours, massage centers, hair salons, skincare studios, nail salons, grooming services and makeup artists online.",
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
                    "Hair Salon Services",
                    "Facials and Skincare",
                    "Bridal Makeup",
                    "Waxing and Threading",
                    "Manicure and Pedicure",
                    "Wellness Booking",
                    "Spa Management Software",
                    "Salon Management Software",
                    "Multi Branch Management",
                    "Appointment Management",
                    "Customer CRM",
                    "Inventory Management",
                    "Campaign Management"
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
                "@id": "https://bookby247.com/#website",
                "name": "Bookby247",
                "alternateName": ["Book by 24/7", "Bookby 247"],
                "url": "https://bookby247.com",
                "inLanguage": "en-IN",
                "description": "Search and book spa, salon, massage, skincare, haircare, nail, grooming and makeup services near you. Business owners can manage branches, appointments, customers and growth tools with Bookby247.",
                "publisher": {
                    "@id": "https://bookby247.com/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://bookby247.com/explore?q={search_term_string}"
                    },
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
