import { getUtmAttributionHeader } from "@/lib/utm-tracking"
import { getBlogApiBaseUrl } from "@/lib/blog-utils"
import { getPublicApiBaseUrl } from "@/lib/api-env"

export interface ApiClientOptions extends RequestInit {
    baseUrl?: string
    authToken?: string | null
    includeAttribution?: boolean
    /** Called when the server returns 401 and a Bearer token was sent (e.g., expired session). */
    onUnauthorized?: () => void
    next?: {
        revalidate?: number | false
        tags?: string[]
    }
}

const DEFAULT_API_BASE_URL = getPublicApiBaseUrl()

const normalizeEndpoint = (endpoint: string) => {
    if (!endpoint) throw new Error("Endpoint is required")

    if (!endpoint.startsWith("/")) {
        endpoint = `/${endpoint}`
    }

    if (endpoint.startsWith("/api/")) {
        endpoint = endpoint.replace(/^\/api/, "")
    }

    return endpoint
}

const csrfTokenCache: Record<string, string> = {}

const fetchCsrfToken = async (baseUrl: string, credentials: RequestCredentials = "include") => {
    const blogApiBaseUrl = getBlogApiBaseUrl();
    const isBlogApi = baseUrl === blogApiBaseUrl;

    if (!isBlogApi) return null;

    if (csrfTokenCache[baseUrl]) {
        return csrfTokenCache[baseUrl];
    }

    try {
        const urlObj = new URL(baseUrl);
        const baseOrigin = urlObj.origin;
        const candidateUrls = [
            `${baseOrigin}/csrf-token`,
            `${baseUrl}/csrf-token`,
        ];

        for (const url of candidateUrls) {
            try {
                const tokenResponse = await fetch(url, {
                    method: "GET",
                    credentials,
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (tokenResponse.ok) {
                    const tokenBody = await tokenResponse.json();
                    if (tokenBody?.csrfToken) {
                        csrfTokenCache[baseUrl] = tokenBody.csrfToken;
                        return tokenBody.csrfToken;
                    }
                }
            } catch {
                /* try next candidate URL */
            }
        }
    } catch {
        /* malformed URL */
    }

    console.warn(`[apiClient] Unable to retrieve CSRF token from ${baseUrl}; proceeding without CSRF header`);
    return null;
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    const { baseUrl, authToken, includeAttribution, onUnauthorized, ...requestInit } = options
    const normalizedEndpoint = normalizeEndpoint(endpoint)
    const apiBaseUrl = (baseUrl || DEFAULT_API_BASE_URL).replace(/\/$/, "")
    const url = `${apiBaseUrl}${normalizedEndpoint}`
    
    console.log(`[apiClient] Making request to: ${url} (apiBaseUrl: ${apiBaseUrl})`)

    let response: Response

    const method = (requestInit.method || "GET").toString().toUpperCase()
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(requestInit.headers || {}),
    } as Record<string, string>

    if (requestInit.body instanceof FormData) {
        delete headers["Content-Type"]
    }

    const shouldIncludeAttribution = includeAttribution ?? (!baseUrl && !["GET", "HEAD", "OPTIONS"].includes(method))
    const attributionHeader = shouldIncludeAttribution ? getUtmAttributionHeader() : null
    if (attributionHeader && !headers["X-UTM-Attribution"] && !headers["x-utm-attribution"]) {
        headers["X-UTM-Attribution"] = attributionHeader
    }

    // ONLY add CSRF token if this is a blog API request
    const blogApiBaseUrl = getBlogApiBaseUrl();
    if (apiBaseUrl === blogApiBaseUrl && !["GET", "HEAD", "OPTIONS"].includes(method) && !headers["x-csrf-token"]) {
        const csrfToken = await fetchCsrfToken(apiBaseUrl, (requestInit.credentials as RequestCredentials) || "include");
        if (csrfToken) {
            headers["x-csrf-token"] = csrfToken;
        }
    }

    try {
        const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
            ...requestInit,
            headers,
            cache: requestInit.cache || "default",
            signal: requestInit.signal || AbortSignal.timeout(30000),
        }
        if (options.next) {
            fetchOptions.next = options.next
        }
        response = await fetch(url, fetchOptions)
    } catch (error) {
        console.error(`[apiClient] Network error -> ${url}`, error)
        throw new Error("Network error: Unable to reach server")
    }

    if (!response.ok) {
        let errorData: any = {}
        try {
            errorData = await response.json()
        } catch { }

        console.error(`[apiClient] API Error ${response.status} -> ${url}`, errorData)
        if (response.status === 401 && authToken) {
            try {
                onUnauthorized?.()
            } catch {
                /* ignore listener errors */
            }
        }
        const extractedMsg =
            errorData?.message ||
            (typeof errorData?.error === "string" ? errorData.error : errorData?.error?.message) ||
            errorData?.details ||
            `API Error: ${response.status}`
        throw new Error(extractedMsg)
    }

    let data: any
    try {
        data = await response.json()
    } catch (error) {
        console.error("[apiClient] Invalid JSON:", error)
        throw new Error("Invalid JSON response")
    }

    let encryptedStr: string | null = null

    if (typeof data === "string") {
        encryptedStr = data
    } else if (data?.payload && typeof data.payload === "string") {
        encryptedStr = data.payload
    }

    if (encryptedStr) {
        try {
            const key = "secure-reviews-key"
            const keyLen = key.length
            const keyCodes = new Uint8Array(keyLen)

            for (let i = 0; i < keyLen; i++) {
                keyCodes[i] = key.charCodeAt(i)
            }

            const binaryString = atob(encryptedStr)
            const bytes = new Uint8Array(binaryString.length)

            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i) ^ keyCodes[i % keyLen]
            }

            const decoded = new TextDecoder().decode(bytes)
            return JSON.parse(decoded) as T
        } catch (error) {
            console.error("[apiClient] Decryption failed:", error)
            return data as T
        }
    }

    return data as T
}
