"use client"

import * as React from "react"
import Link from "next/link"
import {
    Briefcase,
    ChevronDown,
    Menu,
    Locate,
    UserCircle2,
    Handshake,
    X,
    LayoutGrid,
} from "lucide-react"
import { NavInfoBlock } from "../navigation/NavInfoBlock"
import { CityLink } from "../navigation/CityLink"
import { CategoryLink } from "../navigation/CategoryLink"
import { Button } from "../ui/Button"
import { cn } from "@/lib/utils"
import { CATEGORIES_DATA } from "@/lib/constants"
import { useCities } from "@/hooks/useCities"
import { useBlogAuth } from "@/hooks/useBlogAuth"

export const Navbar = () => {
    const { user, isAuthenticated } = useBlogAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [showCities, setShowCities] = React.useState(false)
    const [showCategories, setShowCategories] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { data: cities = ["All Cities"] } = useCities()

    React.useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (ticking) return
            ticking = true
            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 150)
                ticking = false
            })
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Helper function to generate city redirect URL
    const getCityHref = (city: string) => {
        if (city === "All Cities") return "/explore"
        const citySlug = city
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return `/${citySlug}`;
    }

    // Helper function to generate category redirect URL
    const getCategoryHref = (category: string) => {
        const categorySlug = (category || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return `/${categorySlug}-near-me`;
    }

    // Close menus when clicking link
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false)
        setShowCities(false)
        setShowCategories(false)
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
            {/* Top Tier */}
            <div className="relative flex items-center justify-between py-3 md:py-4 border-b border-zinc-50 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 sm:gap-4 md:gap-8 px-6 md:px-0">
                    <Link href="/" className="shrink-0 flex items-center">
                        <img
                            src="https://res.cloudinary.com/dwsv275kv/image/upload/v1774790235/White_and_Black_Simple_Marketing_LinkedIn_Banner_f7aqfk.png" // put your logo inside public folder
                            alt="BookBy247 Logo"
                            width={180}
                            height={60}
                            // priority
                            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                        />
                    </Link>

                    {/* Info Blocks (Desktop Only) */}
                    <div className="hidden lg:flex items-center">
                        <NavInfoBlock
                            icon={Briefcase}
                            title="BookBy247 for Business"
                            subtitle="Trusted by 5,000+ Top Salons & Spas"
                            href="https://business.bookby247.com"
                            target="_blank"
                        />
                    </div>
                </div>

                {/* Sticky Search in Center (Desktop Only - Avoid overlap on tablets/mobile) - REMOVED ON SCROLL AS REQUESTED */}
                <div className="hidden lg:flex flex-1 justify-center px-8 lg:px-12 max-w-3xl" />

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Discover by City (Desktop) */}
                    <div
                        onClick={() => {
                            setShowCities(!showCities)
                            setShowCategories(false)
                        }}
                        className={cn(
                            "hidden md:flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-3 py-2 rounded-md transition-colors",
                            showCities && "bg-zinc-100",
                            scrolled && "lg:flex"
                        )}
                    >
                        <Locate className="w-5 h-5 text-zinc-600" />
                        <span className="text-sm font-bold text-zinc-900">Cities</span>
                        <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200", showCities && "rotate-180")} />
                    </div>

                    {/* Discover by Category (Desktop) */}
                    <div
                        onClick={() => {
                            setShowCategories(!showCategories)
                            setShowCities(false)
                        }}
                        className={cn(
                            "hidden md:flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-3 py-2 rounded-md transition-colors",
                            showCategories && "bg-zinc-100",
                            scrolled && "lg:flex"
                        )}
                    >
                        <LayoutGrid className="w-5 h-5 text-zinc-600" />
                        <span className="text-sm font-bold text-zinc-900">Categories</span>
                        <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200", showCategories && "rotate-180")} />
                    </div>

                    {/* Login/Signup */}
                    <Link
                        href={isAuthenticated ? "/blog/profile" : "/blog/login"}
                        className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-2 md:px-3 py-2 rounded-md transition-colors group"
                    >
                        <UserCircle2 className="w-7 h-7 md:w-8 md:h-8 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        <span className="hidden sm:block text-sm font-bold text-zinc-900">
                            {isAuthenticated ? (user?.name?.split(" ")[0] || "Profile") : "Login"}
                        </span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-zinc-600 hover:text-black rounded-md hover:bg-zinc-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Open mobile menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Bottom Tier (Cities - Desktop Only) */}
            {showCities && (
                <div className="hidden md:block overflow-hidden bg-zinc-50 border-b border-zinc-100">
                    <div className="flex items-center bg-zinc-50 border-b border-zinc-100 overflow-x-auto no-scrollbar scroll-smooth">
                        <div className="flex items-center gap-6 md:gap-8 lg:gap-12 px-6 md:px-12 py-3.5 min-w-max mx-auto">
                            {cities.map((city: string) => (
                                <CityLink
                                    key={city}
                                    name={city}
                                    href={getCityHref(city)}
                                    onClick={handleLinkClick}
                                    className="whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Tier (Categories - Desktop Only) */}
            {showCategories && (
                <div className="hidden md:block overflow-hidden bg-zinc-50 border-b border-zinc-100">
                    <div className="flex items-center bg-zinc-50 px-4 md:px-8 py-3 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-4 lg:gap-8 mx-auto">
                            {CATEGORIES_DATA.map((cat) => (
                                <CategoryLink
                                    key={cat.id}
                                    name={cat.label}
                                    href={getCategoryHref(cat.id)}
                                    onClick={handleLinkClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl overflow-y-auto">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                                <span className="text-2xl font-black italic tracking-tighter text-zinc-900 border-2 border-zinc-900 px-2">BookBy247</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                                    aria-label="Close mobile menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 space-y-6">
                                {/* Login Button */}
                                <Link
                                    href={isAuthenticated ? "/blog/profile" : "/blog/login"}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full"
                                >
                                    <Button variant="primary" className="w-full h-12 font-bold">
                                        {isAuthenticated ? `Profile (${user?.name?.split(" ")[0] || "User"})` : "Login / Signup"}
                                    </Button>
                                </Link>

                                {/* Cities */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                                        Discover By City
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {cities.map((city: string) => (
                                            <Link
                                                key={city}
                                                href={getCityHref(city)}
                                                onClick={handleLinkClick}
                                                className="px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors text-center"
                                            >
                                                {city}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                                        Discover By Category
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CATEGORIES_DATA.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={getCategoryHref(cat.id)}
                                                onClick={handleLinkClick}
                                                className="px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors text-center"
                                            >
                                                {cat.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Business Links */}
                                <div className="space-y-3 pt-4 border-t border-zinc-100">
                                    <a
                                        href="https://business.bookby247.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-lg transition-colors group"
                                    >
                                        <Briefcase className="w-5 h-5 text-zinc-500 group-hover:text-zinc-700" />
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">LOGO for Business</p>
                                            <p className="text-xs text-zinc-500">Trusted by 5,000+ Top Salons & Spas</p>
                                        </div>
                                    </a>
                                    <a
                                        href="https://business.bookby247.com/book-demo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-lg transition-colors group"
                                    >
                                        <Handshake className="w-5 h-5 text-zinc-500 group-hover:text-zinc-700" />
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">Become A Partner</p>
                                            <p className="text-xs text-zinc-500">Start receiving qualified leads</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    )
}
