import { NextRequest } from "next/server";
import { submitIndexNowUrls } from "@/lib/indexnow";
import { businessApi } from "@/api/public/business";
import { blogApi } from "@/api/public/blog";

export const dynamic = "force-dynamic";

type IndexNowPayload = {
  url?: string;
  urls?: string[];
  syncAll?: boolean;
};

async function collectAllPlatformUrls(): Promise<string[]> {
  const allUrls: string[] = [
    "https://bookby247.com/",
    "https://bookby247.com/blog",
    "https://bookby247.com/explore",
    "https://bookby247.com/careers",
    "https://bookby247.com/editorial-standards",
  ];

  try {
    const [blogsRes, tagsRes, bizRes] = await Promise.all([
      blogApi.listBlogs({ limit: 500 }).catch(() => ({ data: [] })),
      businessApi.getSeoTags().catch(() => null),
      businessApi.searchBusinesses({ limit: 1000 }).catch(() => null),
    ]);

    // 1. Add all Blog URLs
    (blogsRes?.data || []).forEach((b: any) => {
      if (b.slug) allUrls.push(`https://bookby247.com/blog/${b.slug}`);
    });

    // 2. Add all Tag URLs
    const tagList = (tagsRes as any)?.data || [];
    if (Array.isArray(tagList)) {
      tagList.forEach((t: any) => {
        if (t.slug) allUrls.push(`https://bookby247.com/tags/${t.slug}`);
      });
    }

    // 3. Add all Business Profile, Review & Appointment URLs
    const data = (bizRes as any)?.data || (bizRes as any)?.payload?.decryptedData || bizRes || {};
    const businesses = data.results || data.businesses || (Array.isArray(data) ? data : []);
    if (Array.isArray(businesses)) {
      businesses.forEach((biz: any) => {
        const slug = biz.slug || biz.bussiness_slug;
        if (slug) {
          allUrls.push(`https://bookby247.com/business/${slug}`);
          allUrls.push(`https://bookby247.com/business/${slug}/reviews`);
          allUrls.push(`https://bookby247.com/business/${slug}/book-appointment`);
        }
      });
    }

    // 4. Add Major City Hub URLs
    const cities = ["mumbai", "thane", "bengaluru", "delhi", "pune", "chennai", "hyderabad", "kolkata"];
    cities.forEach((c) => {
      allUrls.push(`https://bookby247.com/${c}`);
    });
  } catch (error) {
    console.error("[INDEXNOW_COLLECT_ERROR]", error);
  }

  return allUrls;
}

export async function GET(request: NextRequest) {
  const sync = request.nextUrl.searchParams.get("sync");
  if (sync === "all") {
    const urls = await collectAllPlatformUrls();
    const result = await submitIndexNowUrls(urls);
    return Response.json(
      {
        success: result.submitted,
        status: result.status,
        message: result.message,
        totalSubmitted: result.urlList.length,
        submittedUrls: result.urlList,
      },
      { status: result.submitted ? 200 : result.status }
    );
  }

  return Response.json({
    message: "IndexNow API. Send GET /api/indexnow?sync=all or POST /api/indexnow with payload to submit URLs."
  });
}

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.INDEXNOW_SECRET;

  if (configuredSecret) {
    const providedSecret = request.headers.get("x-indexnow-secret");
    if (providedSecret !== configuredSecret) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = (await request.json().catch(() => ({}))) as IndexNowPayload;

  let urlsToSubmit: string[] = [];

  if (payload.syncAll || request.nextUrl.searchParams.get("sync") === "all") {
    urlsToSubmit = await collectAllPlatformUrls();
  } else {
    const queryUrl = request.nextUrl.searchParams.get("url");
    urlsToSubmit = [
      queryUrl,
      payload.url,
      ...(Array.isArray(payload.urls) ? payload.urls : []),
    ].filter(Boolean) as string[];
  }

  const result = await submitIndexNowUrls(urlsToSubmit);

  return Response.json(
    {
      success: result.submitted,
      status: result.status,
      message: result.message,
      totalSubmitted: result.urlList.length,
      submittedUrls: result.urlList,
    },
    { status: result.submitted ? 200 : result.status }
  );
}
