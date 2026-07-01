import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";
import AiReadabilitySection from "@/components/seo/AiReadabilitySection";

export const metadata: Metadata = {
    title: "Cookies Settings | BookBy247",
    description:
        "Review BookBy247 Cookies Settings and learn how cookies are used for login sessions, analytics, user preferences, and platform performance.",
    keywords: [
        "BookBy247 cookies",
        "cookies settings",
        "website tracking preferences",
        "analytics cookies",
        "cookie policy"
    ],
    alternates: {
        canonical: "/cookies-settings"
    },
    openGraph: {
        title: "Cookies Settings - BookBy247",
        description: "Cookies usage and control preferences for BookBy247 users.",
        url: "https://bookby247.com/cookies-settings",
        type: "article"
    }
};

const CookiesSettingsPage = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Cookies Settings", item: "https://bookby247.com/cookies-settings" },
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
                title="Cookies Settings"
                effectiveDate="13 April 2026"
                intro="BookBy247 uses cookies and similar technologies to improve user experience, maintain secure sessions, and understand platform usage patterns."
                sections={[
                    {
                        title: "1. Essential Cookies",
                        content: [
                            "These cookies are required for core website functionality, such as session management, security checks, and booking flow continuity.",
                            "Disabling essential cookies may affect the normal operation of key platform features."
                        ]
                    },
                    {
                        title: "2. Performance and Analytics Cookies",
                        content: [
                            "These cookies help us measure traffic, identify performance bottlenecks, and improve speed and usability.",
                            "Analytics data is used in aggregate and helps optimize user journeys across pages."
                        ]
                    },
                    {
                        title: "3. Preference Cookies",
                        content: [
                            "Preference cookies remember selected settings like city/location context and browsing preferences.",
                            "This helps deliver a more relevant and consistent browsing experience."
                        ]
                    },
                    {
                        title: "4. Managing Cookies",
                        content: [
                            "You can manage or clear cookies through your browser settings at any time.",
                            "For support with cookie-related controls or privacy requests, contact - info@bookby247.com."
                        ]
                    }
                ]}
            />
            <AiReadabilitySection 
                aboutTitle="Your Cookie Preferences"
                aboutContent="We use cookies to ensure that our platform remains secure, efficient, and personalized for every user. You have full control over your cookie settings and can manage them directly through your browser."
            />
        </>
    );
};

export default CookiesSettingsPage;

