/**
 * Central SEO Helper for clean, non-repetitive location headings and titles.
 * Eliminates duplicate location text (e.g. "Spa in Thane in Thane" -> "Spas in Thane").
 * Omits unsupported superlative words ("best", "top-rated") unless genuine rating evidence exists.
 */

export function cleanLocationName(location?: string): string {
  if (!location) return "";
  return location
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes category name into plural/readable format
 */
export function formatCategoryName(category?: string): string {
  if (!category) return "Wellness Centers";
  const cleaned = category.replace(/-/g, " ").trim();
  const lower = cleaned.toLowerCase();
  
  if (lower.endsWith("spa")) return `${cleaned}s`;
  if (lower.endsWith("salon")) return `${cleaned}s`;
  if (lower.endsWith("center")) return `${cleaned}s`;
  if (lower.endsWith("parlour")) return `${cleaned}s`;
  
  return cleaned.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
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

  // Prepend "Top 10" or "Featured" ONLY when evidence exists or explicitly requested
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
 * Builds clean metadata title without duplicate city names.
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
    const loc = cleanLocationName(opts.locality || opts.city || "");
    return loc
      ? `${opts.businessName} ${loc} – Services, Prices & Booking | BookBy247`
      : `${opts.businessName} – Services, Prices & Booking | BookBy247`;
  }

  const { title } = buildCleanHeading(opts);
  return `${title} – Compare & Book Online | BookBy247`;
}
