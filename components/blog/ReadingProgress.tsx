"use client"

import { useReadingProgress } from "@/hooks/useReadingProgress"

export function ReadingProgress() {
    const progress = useReadingProgress()

    return (
        <div className="fixed left-0 right-0 z-[60] h-1 bg-transparent top-[env(safe-area-inset-top,0px)]">
            <div className="h-full bg-black transition-[width]" style={{ width: `${progress}%` }} />
        </div>
    )
}
