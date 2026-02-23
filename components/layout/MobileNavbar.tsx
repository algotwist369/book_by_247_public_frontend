"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Search", icon: Search, href: "/explore" },
    { label: "Free Listing", icon: PlusSquare, href: "/free-listing" },
    { label: "Book Demo", icon: Calendar, href: "/book-demo" },
    { label: "Login", icon: User, href: "/login" },
]

export const MobileNavbar = () => {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-zinc-100 pb-safe">
            <nav className="flex items-center justify-around h-16">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] font-medium transition-colors",
                                isActive ? "text-rose-500" : "text-zinc-500"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
