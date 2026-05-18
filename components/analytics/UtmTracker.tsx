"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtmAttribution } from "@/lib/utm-tracking";

const UtmTracker = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        captureUtmAttribution();
    }, [pathname, searchParams]);

    return null;
};

export default UtmTracker;
