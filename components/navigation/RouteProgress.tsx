"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ROUTE_PROGRESS_EVENT } from "@/lib/navigation-events";

const prefetched = new Set<string>();

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

const getInternalHref = (anchor: HTMLAnchorElement | null) => {
  if (!anchor) return null;

  const rawHref = anchor.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#")) return null;
  if (/^(mailto|tel|sms|whatsapp):/i.test(rawHref)) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  const url = new URL(rawHref, window.location.href);
  if (url.origin !== window.location.origin) return null;

  const href = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;

  return href !== current ? href : null;
};

function RouteProgressInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setActive(false);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const prefetchRoute = (href: string) => {
      if (prefetched.has(href)) return;
      prefetched.add(href);
      router.prefetch(href);
    };

    const handlePointerIntent = (event: PointerEvent | FocusEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      const href = getInternalHref(anchor);
      if (href) prefetchRoute(href);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      const href = getInternalHref(anchor);
      if (!href) return;

      prefetchRoute(href);
      setActive(true);

      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setActive(false), 12000);
    };

    const handleProgrammaticNavigation = (event: Event) => {
      const href = (event as CustomEvent<{ href?: string }>).detail?.href;
      if (href) prefetchRoute(href);

      setActive(true);

      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setActive(false), 12000);
    };

    document.addEventListener("pointerover", handlePointerIntent, { passive: true });
    document.addEventListener("focusin", handlePointerIntent);
    document.addEventListener("click", handleClick, true);
    window.addEventListener(ROUTE_PROGRESS_EVENT, handleProgrammaticNavigation);

    return () => {
      document.removeEventListener("pointerover", handlePointerIntent);
      document.removeEventListener("focusin", handlePointerIntent);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener(ROUTE_PROGRESS_EVENT, handleProgrammaticNavigation);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [router]);

  return (
    <div
      aria-hidden="true"
      className={`fixed left-0 top-0 z-[100] h-0.5 w-full overflow-hidden transition-opacity duration-150 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="route-progress-bar h-full w-1/2 bg-zinc-950 shadow-[0_0_12px_rgba(24,24,27,0.35)]" />
    </div>
  );
}

export default function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressInner />
    </Suspense>
  );
}
