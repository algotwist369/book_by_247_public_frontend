import React from "react";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "bookby247",
        "url": "https://bookby247.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://bookby247.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        "description": "Book Best Spas & Salons Near You. Professional treatments at your fingertips.",
        "sameAs": [
            "https://facebook.com/bookby247",
            "https://instagram.com/bookby247",
            "https://twitter.com/bookby247"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default StructuredData;
