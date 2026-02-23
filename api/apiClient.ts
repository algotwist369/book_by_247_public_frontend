
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:9004/api`
// const API_BASE_URL = "http://localhost:9004/api";

/**
 * Enhanced fetch wrapper for the application
 */
export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
    } catch (error) {
        console.error(`[apiClient] Network error fetching ${url}:`, error);
        throw error;
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[apiClient] API Error ${response.status} from ${url}:`, errorData);
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();

    // The backend often returns a XOR-encrypted base64 string, sometimes nested in a payload property
    let encryptedStr: string | null = null;
    if (typeof data === "string") {
        encryptedStr = data;
    } else if (data && typeof data === "object" && typeof data.payload === "string") {
        encryptedStr = data.payload;
    }

    if (encryptedStr) {
        try {
            const key = "secure-reviews-key";
            const keyLen = key.length;
            const keyCodes = new Uint8Array(keyLen);
            for (let i = 0; i < keyLen; i++) keyCodes[i] = key.charCodeAt(i);

            const binaryString = atob(encryptedStr);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i) ^ keyCodes[i % keyLen];
            }
            const decoded = new TextDecoder().decode(bytes);
            return JSON.parse(decoded) as T;
        } catch (e) {
            console.error("Failed to decrypt or parse response:", e);
            return data as T;
        }
    }

    // If it's already an object, return it (standard unencrypted response)
    return data;
}
