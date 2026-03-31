"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Search,
    Briefcase,
    Calendar,
    CalendarRange,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "For Business", icon: Briefcase, href: "https://business.bookby247.com/bookings", external: true },
    { label: "Search", icon: Search, href: "/explore" },
    { label: "Demo", icon: Calendar, href: "https://business.bookby247.com/book-demo", external: true },
    { label: "Status", icon: CalendarRange, href: "https://business.bookby247.com/my-status", external: true },
]

export const BottomNav = () => {
    const pathname = usePathname()

    // Only show BottomNav on the home page
    const isHome = pathname === "/" || pathname === ""
    if (!isHome) return null

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-4 py-2 z-50">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = !item.external && pathname === item.href
                    const Icon = item.icon
                    const className = cn(
                        "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
                        isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                    )
                    const content = (
                        <>
                            <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-tight",
                                isActive ? "text-zinc-900" : "text-zinc-500"
                            )}>
                                {item.label}
                            </span>
                        </>
                    )

                    return item.external ? (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={className}
                        >
                            {content}
                        </a>
                    ) : (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={className}
                        >
                            {content}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
