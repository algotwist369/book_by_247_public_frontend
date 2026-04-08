/**
 * Resolve API base URL safely
 */
const API_BASE_URL =
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9004/api").replace(/\/$/, ""); // remove trailing slash

/**
 * Normalize endpoint to avoid bugs like:
 * - missing leading slash
 * - double /api
 */
const normalizeEndpoint = (endpoint: string) => {
    if (!endpoint) throw new Error("Endpoint is required");

    // Ensure leading slash
    if (!endpoint.startsWith("/")) {
        endpoint = "/" + endpoint;
    }

    // Prevent double /api
    if (endpoint.startsWith("/api/")) {
        endpoint = endpoint.replace(/^\/api/, "");
    }

    return endpoint;
};

/**
 * Enhanced fetch wrapper
 */
export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const normalizedEndpoint = normalizeEndpoint(endpoint);
    const url = `${API_BASE_URL}${normalizedEndpoint}`;

    // 🔥 Debug (remove in production)
    console.log("🌐 API CALL →", url);

    let response: Response;

    try {
        response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            // Use the cache option from options if provided, otherwise default to "no-store" for dynamic routes
            // but allow Next.js memoization by not forcing no-store if not explicitly asked
            cache: options.cache || "default", 
        });
    } catch (error) {
        console.error(`[apiClient] ❌ Network error → ${url}`, error);
        throw new Error("Network error: Unable to reach server");
    }

    // Handle non-2xx responses
    if (!response.ok) {
        let errorData: any = {};
        try {
            errorData = await response.json();
        } catch { }

        console.error(
            `[apiClient] ❌ API Error ${response.status} → ${url}`,
            errorData
        );

        throw new Error(
            errorData?.message || `API Error: ${response.status}`
        );
    }

    // Parse JSON safely
    let data: any;
    try {
        data = await response.json();
    } catch (error) {
        console.error("[apiClient] ❌ Invalid JSON:", error);
        throw new Error("Invalid JSON response");
    }

    // Handle encrypted response
    let encryptedStr: string | null = null;

    if (typeof data === "string") {
        encryptedStr = data;
    } else if (data?.payload && typeof data.payload === "string") {
        encryptedStr = data.payload;
    }

    if (encryptedStr) {
        try {
            const key = "secure-reviews-key";
            const keyLen = key.length;

            const keyCodes = new Uint8Array(keyLen);
            for (let i = 0; i < keyLen; i++) {
                keyCodes[i] = key.charCodeAt(i);
            }

            const binaryString = atob(encryptedStr);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i) ^ keyCodes[i % keyLen];
            }

            const decoded = new TextDecoder().decode(bytes);
            return JSON.parse(decoded) as T;
        } catch (e) {
            console.error("[apiClient] ❌ Decryption failed:", e);
            return data as T;
        }
    }

    return data as T;
}