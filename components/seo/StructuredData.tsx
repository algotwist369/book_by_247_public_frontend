import React from "react";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SpaAdvisor",
        "url": "https://spaadvisor.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://spaadvisor.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        "description": "Book Best Spas & Salons Near You. Professional treatments at your fingertips.",
        "sameAs": [
            "https://facebook.com/spaadvisor",
            "https://instagram.com/spaadvisor",
            "https://twitter.com/spaadvisor"
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
