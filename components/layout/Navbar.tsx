"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { SearchBar } from "../ui/SearchBar"
import { motion, AnimatePresence } from "framer-motion"
import { CATEGORIES_DATA } from "@/lib/constants"

const CITIES = [
    "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad",
    "Kolkata", "Mumbai", "Noida", "Pune", "All Cities"
]

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [showCities, setShowCities] = React.useState(false)
    const [showCategories, setShowCategories] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const router = useRouter()

    const handleSearch = (q?: string, loc?: string) => {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (loc) params.set('location', loc)
        router.push(`/explore?${params.toString()}`)
    }

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Helper function to generate city redirect URL
    const getCityHref = (city: string) => {
        if (city === "All Cities") return "/explore"
        return `/explore?location=${encodeURIComponent(city)}`
    }

    // Helper function to generate category redirect URL
    const getCategoryHref = (category: string) => {
        return `/explore?category=${encodeURIComponent(category)}`
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
            <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 py-3 md:py-4 border-b border-zinc-50">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/" className="shrink-0">
                        <span className={cn(
                            "text-xl sm:text-2xl font-black italic tracking-tighter text-zinc-900 border-2 border-zinc-900 px-2 leading-none",
                            scrolled && "lg:opacity-0 lg:pointer-events-none lg:w-0 lg:overflow-hidden"
                        )}>
                            LOGO
                        </span>
                    </Link>

                    {/* Info Blocks (Desktop Only) */}
                    <AnimatePresence>
                        {!scrolled && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="hidden lg:flex items-center"
                            >
                                <NavInfoBlock
                                    icon={Briefcase}
                                    title="LOGO for Business"
                                    subtitle="Trusted by 5000 Business"
                                />
                                <NavInfoBlock
                                    icon={Handshake}
                                    title="Become A Partner"
                                    subtitle="Start receiving qualified leads within days"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sticky Search in Center (Desktop Only - Avoid overlap on tablets/mobile) */}
                <div className="hidden lg:flex flex-1 justify-center px-8 lg:px-12 max-w-3xl">
                    <AnimatePresence>
                        {scrolled && (
                            <div className="w-full">
                                <SearchBar isCompact onSearch={handleSearch} />
                            </div>
                        )}
                    </AnimatePresence>
                </div>

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
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-2 md:px-3 py-2 rounded-md transition-colors group">
                        <UserCircle2 className="w-7 h-7 md:w-8 md:h-8 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        <span className="hidden sm:block text-sm font-bold text-zinc-900">Login</span>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-zinc-600 hover:text-black rounded-md hover:bg-zinc-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Bottom Tier (Cities - Desktop Only) */}
            <AnimatePresence>
                {showCities && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="hidden md:block overflow-hidden bg-zinc-50 border-b border-zinc-100"
                    >
                        <div className="flex items-center bg-zinc-50 px-4 md:px-8 py-3 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-4 lg:gap-8 mx-auto">
                                {CITIES.map((city) => (
                                    <CityLink
                                        key={city}
                                        name={city}
                                        href={getCityHref(city)}
                                        onClick={handleLinkClick}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Tier (Categories - Desktop Only) */}
            <AnimatePresence>
                {showCategories && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="hidden md:block overflow-hidden bg-zinc-50 border-b border-zinc-100"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                                    <span className="text-2xl font-black italic tracking-tighter text-zinc-900 border-2 border-zinc-900 px-2">LOGO</span>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 space-y-6">
                                    {/* Login Button */}
                                    <Button variant="primary" className="w-full h-12 font-bold">
                                        Login / Signup
                                    </Button>

                                    {/* Cities */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                                            Discover By City
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {CITIES.map(city => (
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
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-lg transition-colors group"
                                        >
                                            <Briefcase className="w-5 h-5 text-zinc-500 group-hover:text-zinc-700" />
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900">LOGO for Business</p>
                                                <p className="text-xs text-zinc-500">Trusted by 5000 Business</p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-lg transition-colors group"
                                        >
                                            <Handshake className="w-5 h-5 text-zinc-500 group-hover:text-zinc-700" />
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900">Become A Partner</p>
                                                <p className="text-xs text-zinc-500">Start receiving qualified leads</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    )
}
