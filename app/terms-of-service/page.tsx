import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";
import AiReadabilitySection from "@/components/seo/AiReadabilitySection";

export const metadata: Metadata = {
    title: "Terms of Service | BookBy247",
    description:
        "Read the BookBy247 Terms of Service covering account usage, booking responsibilities, platform limitations, and legal terms for all users.",
    keywords: [
        "BookBy247 terms",
        "terms of service",
        "booking platform terms",
        "user agreement",
        "service conditions"
    ],
    alternates: {
        canonical: "/terms-of-service"
    },
    openGraph: {
        title: "Terms of Service - BookBy247",
        description: "Legal terms and conditions for using BookBy247 booking services.",
        url: "https://bookby247.com/terms-of-service",
        type: "article"
    }
};

const TermsOfServicePage = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Terms of Service", item: "https://bookby247.com/terms-of-service" },
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <LegalDocument
                title="Terms of Service"
                effectiveDate="13 April 2026"
                intro="These Terms of Service govern your access to and use of BookBy247. By using the platform, you agree to these terms and applicable laws."
                sections={[
                    {
                        title: "1. Platform Usage",
                        content: [
                            "Users must provide accurate booking information and must not misuse the platform through false bookings, abuse, or unauthorized access attempts.",
                            "BookBy247 may suspend or restrict access for users violating these terms."
                        ]
                    },
                    {
                        title: "2. Booking and Payments",
                        content: [
                            "Bookings are processed based on business availability and confirmation policies.",
                            "Payment terms, cancellation conditions, and refund rules may vary by business and are shown during booking where applicable."
                        ]
                    },
                    {
                        title: "3. Third-Party Businesses",
                        content: [
                            "BookBy247 is a facilitation platform connecting users with listed businesses. Service quality, pricing, and fulfillment are managed by the respective business.",
                            "Users should review business-specific policies before confirming appointments."
                        ]
                    },
                    {
                        title: "4. Liability and Modifications",
                        content: [
                            "BookBy247 is not liable for indirect losses resulting from service interruptions, third-party changes, or booking disputes outside platform control.",
                            "We may update these terms periodically. Continued use after updates means acceptance of revised terms."
                        ]
                    }
                ]}
            />
            <AiReadabilitySection 
                aboutTitle="Clear and Transparent Terms"
                aboutContent="BookBy247 operates as a trusted intermediary between users and wellness service providers. Our terms ensure a fair, transparent, and secure booking environment for everyone involved."
            />
        </>
    );
};

export default TermsOfServicePage;

