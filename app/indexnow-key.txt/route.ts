import { INDEXNOW_KEY } from "@/lib/indexnow";

export const revalidate = false;

export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
