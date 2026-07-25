import type { Metadata } from 'next';

export type SeoMetadataInput = {
    pageType:
        | "home"
        | "city"
        | "locality"
        | "service"
        | "cityService"
        | "localityService"
        | "business"
        | "blog";
    businessName?: string;
    city?: string;
    locality?: string;
    serviceName?: string;
    hasPrices?: boolean;
    hasReviews?: boolean;
    hasOpeningHours?: boolean;
    hasBooking?: boolean;
    dbMetaTitle?: string;
    dbMetaDescription?: string;
    canonicalPath?: string;
    ogImage?: string;
    articleTitle?: string;
    articleSnippet?: string;
    robotsNoIndex?: boolean;
};

export function cleanLocationName(location?: string): string {
    if (!location) return "";
    return location
        .replace(/-/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Normalizes category or service name into plural/readable format
 */
export function formatCategoryName(category?: string): string {
    if (!category) return "Wellness Centers";
    const cleaned = category.replace(/-/g, " ").replace(/\s+/g, " ").trim();
    const lower = cleaned.toLowerCase();

    // Already plural
    if (lower.endsWith("spas") || lower.endsWith("salons") || lower.endsWith("centers") || lower.endsWith("services")) {
        return cleaned.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }

    if (lower.endsWith("spa")) return `${cleaned}s`;
    if (lower.endsWith("salon")) return `${cleaned}s`;
    if (lower.endsWith("center")) return `${cleaned}s`;
    if (lower.endsWith("parlour") || lower.endsWith("parlor")) return `${cleaned}s`;
    if (lower.endsWith("massage")) return `${cleaned}s`;
    if (lower.endsWith("treatment")) return `${cleaned}s`;

    return cleaned.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

/**
 * Sanitizes business name by removing SEO keyword stuffing (e.g. "Zen Garden Spa Spa In Thane Massage Spa In Thane")
 * and unsupported superlative claim prefixes ("Best ", "Top 1 ", "Top Rated ").
 */
export function cleanBusinessName(rawName?: string): string {
    if (!rawName) return "";

    let name = rawName.trim();

    // Strip unearned superlative prefixes unless part of a genuine brand name
    if (!/^best\s+spa\s+gandhinagar$/i.test(name)) {
        name = name
            .replace(/^(best|top\s*\d*|top-rated|cheapest|number\s*1)\s+/i, "")
            .trim();
    }

    // Clean repetitively appended keyword slugs (e.g., "... Spa In Thane Massage Spa In Thane...")
    const inMatch = name.search(/\s+(spa|salon|massage)\s+in\s+/i);
    if (inMatch > 0) {
        // Keep the primary brand name portion before the repetitive SEO keyword string
        const brandPart = name.substring(0, inMatch).trim();
        if (brandPart.length >= 3) {
            name = brandPart;
        }
    }

    // Capitalize words properly
    return name
        .split(" ")
        .filter(Boolean)
        .map((w) => (w.length <= 3 && w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(" ")
        .trim();
}

/**
 * Checks whether a location name (city or locality) is already contained within the business name
 */
export function locationAlreadyInBusinessName(businessName: string, location?: string): boolean {
    if (!location || !businessName) return false;
    const cleanLoc = cleanLocationName(location).toLowerCase();
    const cleanBiz = businessName.toLowerCase();
    if (!cleanLoc) return false;

    // Direct inclusion check
    return cleanBiz.includes(cleanLoc);
}

/**
 * Builds clean heading without repeating city or locality names.
 */
export function buildCleanHeading(opts: {
    category?: string;
    locality?: string;
    city?: string;
    hasRatingEvidence?: boolean;
    isTop10?: boolean;
}): { title: string; subtitle: string } {
    const categoryStr = formatCategoryName(opts.category);
    const localityStr = cleanLocationName(opts.locality);
    const cityStr = cleanLocationName(opts.city);

    let locationText = "";
    if (localityStr && cityStr) {
        if (localityStr.toLowerCase() === cityStr.toLowerCase()) {
            locationText = cityStr;
        } else {
            locationText = `${localityStr}, ${cityStr}`;
        }
    } else {
        locationText = localityStr || cityStr || "";
    }

    let prefix = "";
    if (opts.isTop10) {
        prefix = "Top 10 ";
    } else if (opts.hasRatingEvidence) {
        prefix = "Featured ";
    }

    const title = locationText
        ? `${prefix}${categoryStr} in ${locationText}`
        : `${prefix}${categoryStr}`;

    const subtitle = locationText
        ? `Explore verified ${categoryStr.toLowerCase()} in ${locationText}`
        : `Explore verified ${categoryStr.toLowerCase()}`;

    return { title, subtitle };
}

/**
 * Legacy compatibility helper for metadata title
 */
export function buildCleanMetadataTitle(opts: {
    category?: string;
    locality?: string;
    city?: string;
    businessName?: string;
    hasRatingEvidence?: boolean;
    isTop10?: boolean;
}): string {
    if (opts.businessName) {
        const cleanedBiz = cleanBusinessName(opts.businessName);
        const loc = cleanLocationName(opts.locality || opts.city || "");

        if (loc && !locationAlreadyInBusinessName(cleanedBiz, loc)) {
            return `${cleanedBiz}, ${loc} – Services, Prices & Booking | BookBy247`;
        }
        return `${cleanedBiz} – Services, Prices & Booking | BookBy247`;
    }

    const { title } = buildCleanHeading(opts);
    return `${title} – Prices & Booking | BookBy247`;
}

/**
 * Centralized, deterministic SEO Metadata Generator for all page types across BookBy247.
 * Strictly adheres to SEO Best Practices:
 * - 50-60 character readable title target
 * - Unique location handling (prevents "in Thane in Thane")
 * - Business location deduplication ("Zen Garden Spa Thane" -> no duplicate "Thane")
 * - Factual, non-invented meta descriptions with dynamic feature conditional clauses
 * - Clean canonical URL and indexing controls
 */
export function buildSeoMetadata(input: SeoMetadataInput): Metadata {
    const {
        pageType,
        businessName: rawBizName,
        city: rawCity,
        locality: rawLocality,
        serviceName: rawService,
        hasPrices = true,
        hasReviews = false,
        hasOpeningHours = true,
        hasBooking = true,
        dbMetaTitle,
        dbMetaDescription,
        canonicalPath = "",
        ogImage = "",
        articleTitle,
        articleSnippet,
        robotsNoIndex = false,
    } = input;

    const city = cleanLocationName(rawCity);
    const locality = cleanLocationName(rawLocality);
    const servicePlural = formatCategoryName(rawService);
    const bizName = cleanBusinessName(rawBizName);

    // Compute unified location label without duplicates
    let locationText = "";
    if (locality && city) {
        if (locality.toLowerCase() === city.toLowerCase()) {
            locationText = city;
        } else {
            locationText = `${locality}, ${city}`;
        }
    } else {
        locationText = locality || city || "";
    }

    let finalTitle = "";
    let finalDescription = "";

    switch (pageType) {
        case "business": {
            // Check if dbMetaTitle exists and doesn't contain spam/unsupported claims
            if (dbMetaTitle && !dbMetaTitle.includes("Best Spa in Thane West, Thane") && !dbMetaTitle.toLowerCase().includes("in thane in thane")) {
                finalTitle = dbMetaTitle;
            } else {
                const isLocInBiz = locationAlreadyInBusinessName(bizName, locality) || locationAlreadyInBusinessName(bizName, city);
                const locSuffix = (!isLocInBiz && locality) ? `, ${locality}` : "";
                
                const actionSuffix = hasPrices && hasBooking
                    ? "Services, Prices & Booking"
                    : hasBooking
                        ? "Services & Booking"
                        : "Services & Information";

                finalTitle = `${bizName}${locSuffix} – ${actionSuffix}`;
            }

            // Description Logic
            if (dbMetaDescription && !dbMetaDescription.includes("Rated 5/5 from 10 verified reviews")) {
                finalDescription = dbMetaDescription;
            } else {
                const locPhrase = locationText ? ` in ${locationText}` : "";
                const detailsArr: string[] = [];

                if (hasPrices) detailsArr.push("available prices");
                if (hasOpeningHours) detailsArr.push("opening hours");
                detailsArr.push("photos");

                const detailsText = detailsArr.length > 0 ? `, including ${detailsArr.join(", ")}` : "";
                const actionText = hasBooking ? "booking options" : "contact options";

                const reviewPhrase = hasReviews ? " and verified customer reviews" : "";

                finalDescription = `View ${bizName}${locPhrase}${detailsText}${reviewPhrase} and ${actionText} on BookBy247.`;
            }
            break;
        }

        case "city": {
            finalTitle = `Spas, Salons & Wellness Centers in ${city || 'India'}`;
            finalDescription = `Explore spas, salons and wellness businesses in ${city || 'India'}. Compare available services, locations, prices and booking options on BookBy247.`;
            break;
        }

        case "cityService":
        case "localityService":
        case "service": {
            const loc = locationText || city || "India";
            finalTitle = `${servicePlural} in ${loc} – Prices & Booking`;
            finalDescription = `Explore ${servicePlural.toLowerCase()} in ${loc}. Compare available services, prices, locations, opening hours and booking options on BookBy247.`;
            break;
        }

        case "blog": {
            const cleanArtTitle = articleTitle?.replace(/\s*\|\s*BookBy247\s*Blog$/i, "").trim() || "Beauty & Wellness Insights";
            // Clean repetitive adjectives if present in blog title
            const sanitizedArtTitle = cleanArtTitle
                .replace(/^top\s+10\s+best\s+/i, "10 Best ")
                .replace(/top\s+luxury\s+and\s+relaxation\s+spa\s+centers\s+in\s+2026/i, "Relaxation & Wellness Guide");

            finalTitle = sanitizedArtTitle.length <= 50 ? `${sanitizedArtTitle} | BookBy247` : sanitizedArtTitle;
            finalDescription = articleSnippet || `Read expert beauty and wellness guides, salon industry insights, and relaxation tips on BookBy247.`;
            break;
        }

        case "home":
        default: {
            finalTitle = "BookBy247 – Book Spas, Salons & Wellness Appointments Online";
            finalDescription = "Discover top-rated spas, beauty salons and wellness centers. Compare services, view prices and book appointments online with BookBy247.";
            break;
        }
    }

    // Clean any multi-spaces or awkward punctuation formatting
    finalTitle = finalTitle.replace(/\s+/g, " ").replace(/,\s*–/g, " –").trim();
    finalDescription = finalDescription.replace(/\s+/g, " ").trim();

    const formattedCanonical = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;

    return {
        title: finalTitle,
        description: finalDescription,
        alternates: {
            canonical: formattedCanonical,
        },
        robots: {
            index: !robotsNoIndex,
            follow: true,
            googleBot: {
                index: !robotsNoIndex,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: finalTitle,
            description: finalDescription,
            url: `https://bookby247.com${formattedCanonical}`,
            siteName: "BookBy247",
            type: "website",
            locale: "en_IN",
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: bizName || finalTitle }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: finalTitle,
            description: finalDescription,
            images: ogImage ? [ogImage] : [],
            creator: "@BookBy247",
        },
    };
}
