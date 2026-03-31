import React from "react";
import { safeJsonLdStringify } from "@/lib/utils";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "Bookby247",
                "url": "https://bookby247.com",
                "logo": "https://bookby247.com/logo.png",
                "sameAs": [
                    "https://facebook.com/Bookby247",
                    "https://instagram.com/Bookby247",
                    "https://twitter.com/Bookby247",
                    "https://www.linkedin.com/company/Bookby247"
                ]
            },
            {
                "@type": "WebSite",
                "name": "Bookby247",
                "url": "https://bookby247.com",
                "description": "Book best spas, salons, and wellness services near you with Bookby247.",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://bookby247.com/explore?q={search_term_string}",
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
