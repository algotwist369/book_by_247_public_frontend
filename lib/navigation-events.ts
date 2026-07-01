export const ROUTE_PROGRESS_EVENT = "bookby247:route-progress-start";

export const startRouteProgress = (href?: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ROUTE_PROGRESS_EVENT, { detail: { href } }));
};
