import { buildLlmsFullTxt, getLlmsData } from "@/lib/llms";

export const revalidate = 3600;

export async function GET() {
  const data = await getLlmsData();

  return new Response(buildLlmsFullTxt(data), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
