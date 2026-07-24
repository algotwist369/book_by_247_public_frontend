import { SEO_CONFIG } from "./seo-config";

/**
 * Standard list of tracking and marketing parameters that should never create separate canonical URLs.
 */
export const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ref",
  "_ga",
  "mc_cid",
  "mc_eid",
  "yclid",
]);

interface CanonicalOptions {
  /**
   * Additional query parameters to remove from the canonical URL.
   */
  removeParams?: string[];
  /**
   * Explicit query parameters to retain in canonical (if any).
   */
  keepParams?: string[];
  /**
   * Force lowercase path (default: true).
   */
  forceLowercasePath?: boolean;
}

/**
 * Generates a clean, normalized, absolute canonical URL for BookBy247.
 * 
 * Rules enforced:
 * 1. Base URL is strictly `https://bookby247.com` (never `www`, always `https`).
 * 2. Path is normalized to lowercase (unless explicitly disabled).
 * 3. Removes trailing slashes (except for root `/`).
 * 4. Eliminates double/duplicate slashes.
 * 5. Automatically strips tracking parameters (`utm_*`, `gclid`, `fbclid`, etc.).
 * 6. Safely encodes URL path segments.
 * 
 * @example
 * createCanonicalUrl("/Thane/Spa?utm_source=google&sort=rating")
 * // => "https://bookby247.com/thane/spa"
 */
export function createCanonicalUrl(
  pathAndQuery: string = "/",
  options: CanonicalOptions = {}
): string {
  const {
    removeParams = [],
    keepParams,
    forceLowercasePath = true,
  } = options;

  const baseUrl = SEO_CONFIG.baseUrl.replace(/\/+$/, ""); // "https://bookby247.com"

  if (!pathAndQuery || pathAndQuery === "/" || pathAndQuery === "") {
    return baseUrl;
  }

  // Parse path and search query
  let [rawPath, rawQuery] = pathAndQuery.split("?");

  // Handle absolute URLs passed accidentally
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    try {
      const parsedUrl = new URL(rawPath);
      rawPath = parsedUrl.pathname;
      if (!rawQuery && parsedUrl.search) {
        rawQuery = parsedUrl.search.substring(1);
      }
    } catch {
      rawPath = "/";
    }
  }

  // Ensure leading slash
  if (!rawPath.startsWith("/")) {
    rawPath = `/${rawPath}`;
  }

  // Remove duplicate slashes
  let cleanPath = rawPath.replace(/\/+/g, "/");

  // Lowercase path if required
  if (forceLowercasePath) {
    cleanPath = cleanPath.toLowerCase();
  }

  // Remove trailing slash except for root `/`
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Process query parameters
  const finalParams = new URLSearchParams();

  if (rawQuery) {
    const searchParams = new URLSearchParams(rawQuery);
    const removeSet = new Set([
      ...Array.from(TRACKING_PARAMS),
      ...removeParams.map((p) => p.toLowerCase()),
    ]);

    searchParams.forEach((value, key) => {
      const lowerKey = key.toLowerCase();

      // Skip tracking or explicitly blacklisted params
      if (removeSet.has(lowerKey)) {
        return;
      }

      // If keepParams is specified, only include params in keepParams
      if (keepParams && keepParams.length > 0) {
        if (!keepParams.map((k) => k.toLowerCase()).includes(lowerKey)) {
          return;
        }
      }

      finalParams.append(key, value);
    });
  }

  const queryString = finalParams.toString();
  const fullPath = queryString ? `${cleanPath}?${queryString}` : cleanPath;

  return `${baseUrl}${fullPath}`;
}

/**
 * Checks if a given path contains upper-case characters.
 */
export function hasUppercasePath(path: string): boolean {
  const pathname = path.split("?")[0];
  return /[A-Z]/.test(pathname);
}
