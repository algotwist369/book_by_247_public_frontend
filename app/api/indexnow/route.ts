import { NextRequest } from "next/server";
import { submitIndexNowUrls } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

type IndexNowPayload = {
  url?: string;
  urls?: string[];
};

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.INDEXNOW_SECRET;

  if (configuredSecret) {
    const providedSecret = request.headers.get("x-indexnow-secret");
    if (providedSecret !== configuredSecret) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = (await request.json().catch(() => ({}))) as IndexNowPayload;
  const queryUrl = request.nextUrl.searchParams.get("url");
  const urls = [
    queryUrl,
    payload.url,
    ...(Array.isArray(payload.urls) ? payload.urls : []),
  ].filter(Boolean) as string[];

  const result = await submitIndexNowUrls(urls);

  return Response.json(
    {
      success: result.submitted,
      status: result.status,
      message: result.message,
      submittedUrls: result.urlList,
    },
    { status: result.submitted ? 200 : result.status }
  );
}
