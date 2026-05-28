const HOST = "bookby247.com";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "b2470a5b9c6d4e8f90123456789abcde";
export const INDEXNOW_KEY_LOCATION = `${BASE_URL}/indexnow-key.txt`;

const normalizeUrl = (url: string) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url.startsWith("/") ? `${BASE_URL}${url}` : url);
    if (parsedUrl.hostname !== HOST) return null;
    parsedUrl.hash = "";
    return parsedUrl.toString();
  } catch {
    return null;
  }
};

export const normalizeIndexNowUrls = (urls: string[]) =>
  Array.from(new Set(urls.map(normalizeUrl).filter(Boolean))) as string[];

export async function submitIndexNowUrls(urls: string[]) {
  const urlList = normalizeIndexNowUrls(urls).slice(0, 10000);

  if (urlList.length === 0) {
    return {
      submitted: false,
      status: 400,
      message: "No valid Bookby247 URLs were provided.",
      urlList,
    };
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList,
    }),
  });

  return {
    submitted: response.ok,
    status: response.status,
    message: response.ok ? "URLs submitted to IndexNow." : await response.text(),
    urlList,
  };
}
