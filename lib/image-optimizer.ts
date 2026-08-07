/**
 * High-performance image URL optimizer for BookBy247
 * Dynamically injects Cloudinary, Unsplash, and Google CDN image sizing params
 * to prevent delivering unscaled multi-megabyte images to client browsers.
 */

export function getOptimizedImageUrl(src: string | undefined, targetWidth = 400, quality = 80): string {
  if (!src || typeof src !== "string") return "";

  const trimmed = src.trim();
  if (!trimmed || trimmed.length <= 3) return "";

  // Cloudinary Optimization (Inject f_auto, q_auto, w_width)
  if (trimmed.includes("res.cloudinary.com") && !trimmed.includes("/f_auto") && !trimmed.includes("/q_auto")) {
    return trimmed.replace("/upload/", `/upload/f_auto,q_auto,w_${targetWidth},c_limit/`);
  }

  // Unsplash Optimization (Inject width, quality, auto=format)
  if (trimmed.includes("images.unsplash.com")) {
    try {
      const url = new URL(trimmed);
      url.searchParams.set("w", targetWidth.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("auto", "format");
      return url.toString();
    } catch {
      return trimmed;
    }
  }

  // Google User Content (Inject s400/w400 params)
  if (trimmed.includes("googleusercontent.com") && !trimmed.includes("=s") && !trimmed.includes("=w")) {
    return `${trimmed}=w${targetWidth}-h${Math.round(targetWidth * 0.75)}-rw`;
  }

  return trimmed;
}
