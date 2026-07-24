/**
 * Central utility to normalize business objects fetched from any API endpoint.
 * Prevents missing business names, invalid images, broken canonical slugs,
 * and ensures genuine ratings/reviews without synthetic fallbacks.
 */

export interface NormalizedBusiness {
  id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  price: number;
  location: string;
  city: string;
  locality: string;
  category: string;
  categories: string[];
  description: string;
  isOpen?: boolean;
}

export function normalizeBusiness(b: any): NormalizedBusiness {
  if (!b || typeof b !== "object") {
    return {
      id: "",
      name: "Wellness Business",
      slug: "",
      image: "",
      images: [],
      rating: 0,
      reviews: 0,
      price: 0,
      location: "",
      city: "",
      locality: "",
      category: "Wellness Center",
      categories: ["Wellness Center"],
      description: "Explore wellness services and treatments.",
    };
  }

  const rawImages = Array.isArray(b.images) ? b.images : [];
  const galleryImages = Array.isArray(b.gallery) ? b.gallery : [];
  const nestedGallery = Array.isArray(b.images?.gallery) ? b.images.gallery : [];

  const combinedImages = Array.from(
    new Set([
      b.thumbnailImage,
      b.logoImage,
      ...rawImages,
      ...galleryImages,
      ...nestedGallery,
      b.image,
      b.images?.banner,
      b.images?.logo,
      b.images?.thumbnail,
    ])
  ).filter((img): img is string => typeof img === "string" && img.length > 5);

  const name =
    b.name ||
    b.businessName ||
    b.bussiness_name ||
    b.title ||
    b.search_profile?.name ||
    "Wellness Business";

  const slug =
    b.slug ||
    b.bussiness_slug ||
    b.business_slug ||
    (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "");

  // Genuine ratings & review counts ONLY - NO DEFAULT 5 or 10!
  const rating = Number(
    b.averageRating ??
      b.rating ??
      b.avg_rating ??
      b.ratings?.average ??
      b.ratings?.averageRating ??
      0
  );

  const reviews = Number(
    b.totalReviews ??
      b.reviews ??
      b.total_reviews ??
      b.ratings?.totalReviews ??
      b.ratings?.total_reviews ??
      0
  );

  const city =
    b.city ||
    b.location_info?.city ||
    b.location?.city ||
    b.address_info?.city ||
    "";

  const locality =
    b.locality ||
    b.area ||
    b.location_info?.area ||
    b.location?.area ||
    b.address_info?.area ||
    "";

  const locationStr =
    b.location ||
    (locality && city ? `${locality}, ${city}` : locality || city || "");

  const description =
    b.description ||
    b.seo?.metaDescription ||
    b.shortDescription ||
    `Wellness and beauty treatments available at ${name}${locationStr ? ` in ${locationStr}` : ""}.`;

  const price = Number(b.price ?? b.startingPrice ?? b.starting_price ?? 0);

  return {
    id: String(b.id || b._id || slug),
    name,
    slug,
    image: combinedImages[0] || "",
    images: combinedImages,
    rating: isNaN(rating) || rating < 0 ? 0 : Number(rating.toFixed(1)),
    reviews: isNaN(reviews) || reviews < 0 ? 0 : Math.floor(reviews),
    price: isNaN(price) || price < 0 ? 0 : price,
    location: locationStr,
    city,
    locality,
    category: b.category || (Array.isArray(b.categories) ? b.categories[0] : "Wellness Center"),
    categories: b.category ? [b.category] : Array.isArray(b.categories) ? b.categories : ["Wellness Center"],
    description,
    isOpen: typeof b.isOpen === "boolean" ? b.isOpen : undefined,
  };
}
