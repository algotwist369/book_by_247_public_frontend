export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type UtmTouch = Partial<Record<UtmKey, string>> & {
    landingPage?: string;
    referrer?: string;
    capturedAt?: string;
};

export type UtmAttribution = {
    firstTouch: UtmTouch;
    lastTouch: UtmTouch;
};

const STORAGE_KEY = "bookby247_utm_attribution";
const COOKIE_KEY = "bookby247_utm";
const ATTRIBUTION_TTL_DAYS = 90;

const isBrowser = () => typeof window !== "undefined";

const cleanValue = (value: string | null, maxLength = 200) => {
    const cleaned = (value || "").replace(/\u0000/g, "").trim();
    return cleaned ? cleaned.slice(0, maxLength) : undefined;
};

const hasCampaignParams = (params: URLSearchParams) => UTM_KEYS.some((key) => !!cleanValue(params.get(key)));

const getFallbackTouch = (landingPage: string): UtmTouch => {
    const referrer = cleanValue(document.referrer, 1000);

    if (referrer) {
        try {
            const referrerUrl = new URL(referrer);
            if (referrerUrl.hostname !== window.location.hostname) {
                return {
                    utm_source: referrerUrl.hostname.replace(/^www\./, ""),
                    utm_medium: "referral",
                    landingPage,
                    referrer,
                    capturedAt: new Date().toISOString()
                };
            }
        } catch { }
    }

    return {
        utm_source: "direct",
        utm_medium: "none",
        landingPage,
        referrer,
        capturedAt: new Date().toISOString()
    };
};

const getCampaignTouch = (params: URLSearchParams, landingPage: string): UtmTouch => {
    const touch: UtmTouch = {
        landingPage,
        referrer: cleanValue(document.referrer, 1000),
        capturedAt: new Date().toISOString()
    };

    UTM_KEYS.forEach((key) => {
        const value = cleanValue(params.get(key));
        if (value) touch[key] = value;
    });

    return touch;
};

const readStoredAttribution = (): UtmAttribution | null => {
    if (!isBrowser()) return null;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as UtmAttribution;
        if (!parsed?.firstTouch || !parsed?.lastTouch) return null;
        return parsed;
    } catch {
        return null;
    }
};

const toBase64Url = (value: string) => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const persistAttribution = (attribution: UtmAttribution) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));

    const expires = new Date(Date.now() + ATTRIBUTION_TTL_DAYS * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_KEY}=${toBase64Url(JSON.stringify(attribution))}; expires=${expires}; path=/; SameSite=Lax`;
};

export const captureUtmAttribution = () => {
    if (!isBrowser()) return null;

    const params = new URLSearchParams(window.location.search);
    const landingPage = `${window.location.pathname}${window.location.search}`;
    const stored = readStoredAttribution();
    const hasCampaign = hasCampaignParams(params);

    if (!hasCampaign && stored) return stored;

    const currentTouch = hasCampaign
        ? getCampaignTouch(params, landingPage)
        : getFallbackTouch(landingPage);

    const nextAttribution = {
        firstTouch: stored?.firstTouch || currentTouch,
        lastTouch: hasCampaign ? currentTouch : (stored?.lastTouch || currentTouch)
    };

    persistAttribution(nextAttribution);
    return nextAttribution;
};

export const getStoredUtmAttribution = () => readStoredAttribution();

export const getUtmAttributionHeader = () => {
    if (!isBrowser()) return null;
    const attribution = captureUtmAttribution() || readStoredAttribution();
    if (!attribution) return null;
    return toBase64Url(JSON.stringify(attribution));
};
