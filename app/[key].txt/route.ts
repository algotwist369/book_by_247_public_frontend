import { INDEXNOW_KEY } from "@/lib/indexnow";

export const revalidate = false;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  // Serve key if requested key matches INDEXNOW_KEY or indexnow-key
  if (key === INDEXNOW_KEY || key === "indexnow-key" || key.includes("b2470a5b9c6d4e8f90123456789abcde")) {
    return new Response(INDEXNOW_KEY, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  return new Response(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
