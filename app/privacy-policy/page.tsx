import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";
import AiReadabilitySection from "@/components/seo/AiReadabilitySection";

export const metadata: Metadata = {
    title: "Privacy Policy | Bookby247",
    description:
        "Read the official Bookby247 Privacy Policy to understand how we collect, use, secure, and manage your personal information across our booking platform.",
    keywords: [
        "Bookby247 privacy policy",
        "data privacy",
        "personal data protection",
        "booking platform privacy",
        "user data usage policy"
    ],
    alternates: {
        canonical: "/privacy-policy"
    },
    openGraph: {
        title: "Privacy Policy - Bookby247",
        description: "Official privacy practices and user data handling policy of Bookby247.",
        url: "https://bookby247.com/privacy-policy",
        type: "article"
    }
};

const PrivacyPolicyPage = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Privacy Policy", item: "https://bookby247.com/privacy-policy" },
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
                title="Privacy Policy"
                effectiveDate="13 April 2026"
                intro="This Privacy Policy explains how Bookby247 collects, uses, stores, and protects your personal information when you use our website, booking pages, and related services."
                sections={[
                    {
                        title: "1. Information We Collect",
                        content: [
                            "We may collect personal details such as your name, phone number, email address, booking preferences, and appointment history when you interact with our platform.",
                            "We also collect basic technical data such as device type, browser details, and usage analytics to improve platform performance and reliability."
                        ]
                    },
                    {
                        title: "2. How We Use Your Data",
                        content: [
                            "Your information is used to process bookings, share appointment updates, verify requests, provide customer support, and improve service quality.",
                            "We may use limited communication details to send booking confirmations, reminders, and relevant service updates."
                        ]
                    },
                    {
                        title: "3. Data Sharing and Security",
                        content: [
                            "We share booking-related information only with the relevant business/service provider required to complete your appointment.",
                            "Bookby247 applies reasonable technical and organizational safeguards to protect user data from unauthorized access or misuse."
                        ]
                    },
                    {
                        title: "4. Your Rights",
                        content: [
                            "You can request correction or deletion of personal data where legally applicable.",
                            "You can contact us to understand what data is retained and for what purpose."
                        ]
                    }
                ]}
            />
            <AiReadabilitySection 
                aboutTitle="Your Data, Your Trust"
                aboutContent="At Bookby247, we prioritize user privacy and data security. We only collect information necessary to provide you with a seamless booking experience and never share your personal details with third parties for marketing purposes."
            />
        </>
    );
};

export default PrivacyPolicyPage;

