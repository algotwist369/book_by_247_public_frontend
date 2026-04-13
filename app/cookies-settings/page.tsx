import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
    title: "Cookies Settings",
    description:
        "Review Bookby247 Cookies Settings and learn how cookies are used for login sessions, analytics, user preferences, and platform performance.",
    keywords: [
        "Bookby247 cookies",
        "cookies settings",
        "website tracking preferences",
        "analytics cookies",
        "cookie policy"
    ],
    alternates: {
        canonical: "/cookies-settings"
    },
    openGraph: {
        title: "Cookies Settings - Bookby247",
        description: "Cookies usage and control preferences for Bookby247 users.",
        url: "https://bookby247.com/cookies-settings",
        type: "article"
    }
};

const CookiesSettingsPage = () => {
    return (
        <LegalDocument
            title="Cookies Settings"
            effectiveDate="13 April 2026"
            intro="Bookby247 uses cookies and similar technologies to improve user experience, maintain secure sessions, and understand platform usage patterns."
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
    );
};

export default CookiesSettingsPage;

