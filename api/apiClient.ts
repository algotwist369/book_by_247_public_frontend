import { getUtmAttributionHeader } from "@/lib/utm-tracking"

export interface ApiClientOptions extends RequestInit {
    baseUrl?: string
    authToken?: string | null
    includeAttribution?: boolean
    /** Called when the server returns 401 and a Bearer token was sent (e.g. expired session). */
    onUnauthorized?: () => void
}

const DEFAULT_API_BASE_URL =
    (process.env.NEXT_PUBLIC_API_URL || "https://api.bookby247.com/api").replace(/\/$/, "")

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
    const urlObj = new URL(baseUrl)
    const baseOrigin = urlObj.origin
    const basePath = urlObj.pathname.replace(/\/$/, "")
    
    // Cache key should be the full base URL, not just origin
    if (csrfTokenCache[baseUrl]) {
        return csrfTokenCache[baseUrl]
    }

    // Try 1: With base path (for main API)
    const tokenUrlWithPath = `${baseOrigin}${basePath}/csrf-token`
    try {
        const tokenResponse = await fetch(tokenUrlWithPath, {
            method: "GET",
            credentials,
            headers: {
                Accept: "application/json",
            },
        })

        if (tokenResponse.ok) {
            const tokenBody = await tokenResponse.json()
            if (tokenBody?.csrfToken) {
                csrfTokenCache[baseUrl] = tokenBody.csrfToken
                return tokenBody.csrfToken
            }
        }
    } catch {
        // Ignore error and try fallback
    }

    // Try 2: At origin (for blog API)
    const tokenUrlAtOrigin = `${baseOrigin}/csrf-token`
    try {
        const tokenResponse = await fetch(tokenUrlAtOrigin, {
            method: "GET",
            credentials,
            headers: {
                Accept: "application/json",
            },
        })

        if (!tokenResponse.ok) {
            let errorData = {}
            try {
                errorData = await tokenResponse.json()
            } catch { }
            console.error(`[apiClient] CSRF token fetch failed -> ${tokenUrlAtOrigin} (also tried ${tokenUrlWithPath})`, errorData)
            throw new Error("Unable to retrieve CSRF token")
        }

        const tokenBody = await tokenResponse.json()
        if (!tokenBody?.csrfToken) {
            throw new Error("Invalid CSRF token response")
        }

        csrfTokenCache[baseUrl] = tokenBody.csrfToken
        return tokenBody.csrfToken
    } catch (error) {
        console.error(`[apiClient] All CSRF token fetch attempts failed`, error)
        throw new Error("Unable to retrieve CSRF token")
    }
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    const { baseUrl, authToken, includeAttribution, onUnauthorized, ...requestInit } = options
    const normalizedEndpoint = normalizeEndpoint(endpoint)
    const apiBaseUrl = (baseUrl || DEFAULT_API_BASE_URL).replace(/\/$/, "")
    const url = `${apiBaseUrl}${normalizedEndpoint}`

    let response: Response

    const method = (requestInit.method || "GET").toString().toUpperCase()
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(requestInit.headers || {}),
    } as Record<string, string>

    const shouldIncludeAttribution = includeAttribution ?? (!baseUrl && !["GET", "HEAD", "OPTIONS"].includes(method))
    const attributionHeader = shouldIncludeAttribution ? getUtmAttributionHeader() : null
    if (attributionHeader && !headers["X-UTM-Attribution"] && !headers["x-utm-attribution"]) {
        headers["X-UTM-Attribution"] = attributionHeader
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(method) && !headers["x-csrf-token"]) {
        const csrfToken = await fetchCsrfToken(apiBaseUrl, (requestInit.credentials as RequestCredentials) || "include")
        headers["x-csrf-token"] = csrfToken
    }

    try {
        response = await fetch(url, {
            ...requestInit,
            headers,
            cache: requestInit.cache || "default",
        })
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
        throw new Error(errorData?.message || `API Error: ${response.status}`)
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
