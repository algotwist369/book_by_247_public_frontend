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
  let targetHost = host;
  let targetPathname = pathname;

  // 2. Force non-www production domain
  if (host.startsWith("www.")) {
    targetHost = host.replace(/^www\./, "");
    shouldRedirect = true;
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
    const redirectUrl = new URL(
      `${targetPathname}${search}`,
      `https://${targetHost}`
    );

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
