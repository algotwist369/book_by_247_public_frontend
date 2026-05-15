"use client"

import { cn } from "@/lib/utils"

export function TableOfContents({
    headings,
    compact = false,
}: {
    headings: Array<{ id: string; text: string; level: number }>
    /** Mobile drawer / collapsible: no sticky, shorter scroll, optional title hidden via parent */
    compact?: boolean
}) {
    if (!headings.length) return null

    return (
        <nav aria-label="On this page" className={cn(!compact && "sticky top-28 w-full py-2")}>
            {!compact ? (
                <p className="text-[13px] font-medium tracking-tight text-zinc-500">On this page</p>
            ) : null}
            <div
                className={cn(
                    "overflow-y-auto overflow-x-hidden overscroll-y-contain pr-2 [-ms-overflow-style:auto] [scrollbar-color:rgba(161,161,170,0.8)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300/90 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5",
                    compact ? "mt-0 max-h-[min(40vh,240px)]" : "mt-4 max-h-[min(72vh,calc(100vh-8rem))]"
                )}
            >
                <ul className={cn("space-y-0.5 pb-4", compact && "pb-1")}>
                    {headings.map((heading, idx) => (
                        <li key={`${heading.id}-${idx}`}>
                            <a
                                href={`#${heading.id}`}
                                className={`block rounded-md py-1.5 text-[13px] leading-snug text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100 ${heading.level >= 3 ? "pl-5" : heading.level === 2 ? "pl-3" : ""}`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
