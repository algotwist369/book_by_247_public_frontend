"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Search,
    Briefcase,
    Calendar,
    CalendarRange ,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Search", icon: Search, href: "/explore" },
    { label: "For Business", icon: Briefcase, href: "/bookings" },
    { label: "Demo", icon: Calendar, href: "/book-demo" },
    { label: "Status", icon: CalendarRange, href: "/my-status" },
]

export const BottomNav = () => {
    const pathname = usePathname()

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-4 py-2 z-50">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
                                isActive ? "text-[#FF4D4D]" : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-tight",
                                isActive ? "text-[#FF4D4D]" : "text-zinc-500"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
