import React from "react";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";

const StructuredData = () => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
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
