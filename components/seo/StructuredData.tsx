import React from "react";
import { safeJsonLdStringify } from "@/lib/utils";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "bookby247",
                "url": "https://bookby247.com",
                "logo": "https://bookby247.com/logo.png",
                "sameAs": [
                    "https://facebook.com/bookby247",
                    "https://instagram.com/bookby247",
                    "https://twitter.com/bookby247",
                    "https://www.linkedin.com/company/bookby247"
                ]
            },
            {
                "@type": "WebSite",
                "name": "bookby247",
                "url": "https://bookby247.com",
                "description": "Book best spas, salons, and wellness services near you with bookby247.",
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
