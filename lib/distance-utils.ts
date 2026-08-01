/**
 * Utility functions for 100% real geolocation distance calculation.
 * Ensures zero dummy distances are ever shown to users.
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Extracts valid latitude and longitude coordinates from a Business object.
 * Handles both GeoJSON { type: "Point", coordinates: [lng, lat] } and { coordinates: { lat, lng } }.
 */
export function getBusinessCoordinates(business: any): Coordinates | null {
    if (!business) return null;

    // 1. Check coordinates object { lat, lng }
    if (
        business.coordinates &&
        typeof business.coordinates.lat === "number" &&
        typeof business.coordinates.lng === "number" &&
        !isNaN(business.coordinates.lat) &&
        !isNaN(business.coordinates.lng) &&
        (business.coordinates.lat !== 0 || business.coordinates.lng !== 0)
    ) {
        return { lat: business.coordinates.lat, lng: business.coordinates.lng };
    }

    // 2. Check GeoJSON location object { type: "Point", coordinates: [lng, lat] }
    if (
        business.location &&
        Array.isArray(business.location.coordinates) &&
        business.location.coordinates.length === 2
    ) {
        const [lng, lat] = business.location.coordinates;
        if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng) &&
            (lat !== 0 || lng !== 0)
        ) {
            return { lat, lng };
        }
    }

    // 3. Check direct lat / lng fields
    if (
        typeof business.lat === "number" &&
        typeof business.lng === "number" &&
        !isNaN(business.lat) &&
        !isNaN(business.lng) &&
        (business.lat !== 0 || business.lng !== 0)
    ) {
        return { lat: business.lat, lng: business.lng };
    }

    return null;
}

/**
 * Calculates real distance in kilometers using Haversine formula.
 * Returns null if any coordinate is missing.
 */
export function calculateRealDistanceKm(
    lat1?: number | null,
    lng1?: number | null,
    lat2?: number | null,
    lng2?: number | null
): number | null {
    if (
        lat1 == null ||
        lng1 == null ||
        lat2 == null ||
        lng2 == null ||
        isNaN(lat1) ||
        isNaN(lng1) ||
        isNaN(lat2) ||
        isNaN(lng2)
    ) {
        return null;
    }

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    return parseFloat(dist.toFixed(1));
}

/**
 * Formats distance in meters if under 1 km, otherwise in km.
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm} km`;
}
