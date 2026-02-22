import React from "react";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "logoname",
        "url": "https://logoname.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://logoname.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        "description": "Book Best Spas & Salons Near You. Professional treatments at your fingertips.",
        "sameAs": [
            "https://facebook.com/logoname",
            "https://instagram.com/logoname",
            "https://twitter.com/logoname"
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
