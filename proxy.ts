import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// File extension pattern to ignore static asset requests
const PUBLIC_FILE = /\.(.*)$/;

// Private, API, or static routes that should not undergo path rewriting or canonical redirects
const EXCLUDED_PREFIXES = [
  "/_next",
  "/api",
  "/admin",
  "/dashboard",
  "/auth",
  "/login",
  "/register",
  "/booking-status",
  "/uploads",
];

export function proxy(request: NextRequest) {
  const { pathname, search, host } = request.nextUrl;

  // 1. Skip system files, static assets, and internal routes
  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  let shouldRedirect = false;
  let targetPathname = pathname;

  // Extract real host behind reverse proxy (Nginx / Cloudflare / Vercel)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const headerHost = request.headers.get("host");
  const rawHost = (forwardedHost || headerHost || host || "").split(":")[0];

  let targetHost = "bookby247.com";

  // 2. Force non-www production domain
  if (rawHost.startsWith("www.") || rawHost === "www.bookby247.com") {
    shouldRedirect = true;
  } else if (rawHost.length > 0 && rawHost !== "localhost" && rawHost !== "127.0.0.1") {
    targetHost = rawHost.replace(/^www\./, "");
  }

  // 3. Enforce lowercase path segments (preserve search parameters as-is)
  if (/[A-Z]/.test(targetPathname)) {
    targetPathname = targetPathname.toLowerCase();
    shouldRedirect = true;
  }

  // 4. Remove trailing slash (except root `/`)
  if (targetPathname.length > 1 && targetPathname.endsWith("/")) {
    targetPathname = targetPathname.slice(0, -1);
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    const redirectUrl = `https://${targetHost}${targetPathname}${search}`;

    return NextResponse.redirect(redirectUrl, {
      status: 301,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
