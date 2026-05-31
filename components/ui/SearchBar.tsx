"use client"

import * as React from "react"
import { MapPin, Search, X, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocationSuggestions } from "../../hooks/useLocationSuggestions"
import { useGeolocation } from "../../hooks/useGeolocation"
import { useRouter } from "next/navigation"
import LocationPermissionModal from "./LocationPermissionModal"

interface SearchBarProps {
    className?: string
    isCompact?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    locationValue?: string
    onLocationChange?: (value: string) => void
    onSearch?: (q?: string, loc?: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({
    className,
    isCompact = false,
    value,
    onChange,
    locationValue = "",
    onLocationChange,
    onSearch
}) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [localLocation, setLocalLocation] = React.useState(locationValue);
    const [showLocationModal, setShowLocationModal] = React.useState(false);
    const { data: suggestions, isLoading } = useLocationSuggestions(localLocation, showSuggestions);
    const { getPosition, latitude, longitude, isFetching, error: geoError } = useGeolocation();
    const router = useRouter();

    React.useEffect(() => {
        if (latitude && longitude) {
            router.push(`/explore?lat=${latitude}&lng=${longitude}&nearby=true`);
        }
    }, [latitude, longitude, router]);

    const handleNearbyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLocationModal(true);
    };

    const handleAllowLocation = () => {
        getPosition();
        setShowLocationModal(false);
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalLocation(val);
        if (onLocationChange) onLocationChange(val);
        setShowSuggestions(true);
    };

    const selectSuggestion = (s: any) => {
        const val = s.description;
        setLocalLocation(val);
        if (onLocationChange) onLocationChange(val);
        setShowSuggestions(false);
        onSearch?.(value, val);
    };

    return (
        <div className="relative w-full px-6 md:px-0">
            {/* ── Desktop: horizontal pill ── */}
            <div
                className={cn(
                    "hidden md:flex items-center w-full bg-white border border-zinc-200 rounded-full",
                    isCompact ? "max-w-3xl" : "max-w-5xl",
                    className
                )}
            >
                {/* Search input */}
                <div className="flex-[1.5] flex items-center gap-2 px-4 border-r border-zinc-200 h-14">
                    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                        id="desktop-search-input"
                        name="desktop-search"
                        type="text"
                        placeholder={isCompact ? "What are you looking for?" : "Search hair salon, spa, beauty parlour, bridal makeup...t"}
                        value={value}
                        onChange={onChange}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch?.(value, localLocation)}
                        className="w-full h-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none"
                    />
                    {value && (
                        <button
                            onClick={() => {
                                onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
                                onSearch?.('', localLocation);
                            }}
                            aria-label="Clear search"
                            className="shrink-0"
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                </div>

                {/* Location input */}
                <div className="flex-1 relative flex items-center gap-2 px-4 h-14">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                        id="desktop-location-input"
                        name="desktop-location"
                        type="text"
                        placeholder="Enter your city or area (e.g., Mumbai, Delhi)"
                        value={localLocation}
                        onChange={handleLocationChange}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setShowSuggestions(false);
                                onSearch?.(value, localLocation);
                            }
                        }}
                        className="w-full h-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none"
                    />
                    {/* Near Me button */}
                    <button
                        onClick={handleNearbyClick}
                        disabled={isFetching}
                        className="shrink-0 flex items-center gap-1.5 text-xs text-zinc-500 disabled:opacity-40 bg-gray-100 px-2 py-1 rounded-lg"
                        aria-label="Use my location"
                    >
                        <Navigation className="w-3.5 h-3.5 text-black" />
                        <span>{isFetching ? 'Locating...' : 'Nearby'}</span>
                    </button>

                    {/* Desktop permission error */}
                    {geoError && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-orange-50 border border-orange-200 rounded-xl z-50 px-3 py-2.5 flex items-start gap-2">
                            <Navigation className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-orange-700">Location access denied</p>
                                <p className="text-[11px] text-orange-600 mt-0.5">Please allow location access in your browser settings and try again.</p>
                            </div>
                        </div>
                    )}

                    {/* Desktop suggestions */}
                    {showSuggestions && (suggestions?.length > 0 || isLoading) && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl z-50 overflow-hidden">
                            {isLoading ? (
                                <div className="px-4 py-3 text-sm text-zinc-400">Searching...</div>
                            ) : (
                                suggestions.map((s: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectSuggestion(s)}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left border-b border-zinc-100 last:border-none"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                        <div>
                                            <p className="text-sm text-zinc-900">{s.mainText}</p>
                                            <p className="text-xs text-zinc-500">{s.secondaryText}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Search button */}
                <div className="px-2 py-2">
                    <button
                        onClick={() => onSearch?.(value, localLocation)}
                        className="bg-black text-white text-sm font-semibold rounded-full px-6 h-10"
                    >
                        {isCompact ? <Search className="w-4 h-4" /> : "Search"}
                    </button>
                </div>
            </div>

            {/* ── Mobile: vertical stack ── */}
            <div className={cn("flex md:hidden flex-col w-full bg-white border border-zinc-200 rounded-2xl p-3 gap-2", className)}>
                {/* Search */}
                <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 h-11">
                    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                        id="mobile-search-input"
                        name="mobile-search"
                        type="text"
                        placeholder="Search services..."
                        value={value}
                        onChange={onChange}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
                        className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none"
                    />
                    {value && (
                        <button
                            onClick={() => {
                                onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
                                onSearch?.('', localLocation);
                            }}
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                </div>

                {/* Location */}
                <div className="relative">
                    <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 h-11">
                        <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                        <input
                            id="mobile-location-input"
                            name="mobile-location"
                            type="text"
                            placeholder="Location"
                            value={localLocation}
                            onChange={handleLocationChange}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setShowSuggestions(false);
                                    onSearch?.(value, localLocation);
                                }
                            }}
                            className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none"
                        />
                        {/* Near Me (Mobile) */}
                        <button
                            onClick={handleNearbyClick}
                            disabled={isFetching}
                            className="shrink-0 flex items-center gap-1 text-xs text-zinc-500 disabled:opacity-40 bg-gray-100 px-2 py-1 rounded-lg"
                        >
                            <Navigation className="w-3.5 h-3.5 text-black" />
                            <span>{isFetching ? 'Locating...' : 'Nearby'}</span>
                        </button>
                    </div>

                    {/* Mobile permission error */}
                    {geoError && (
                        <div className="mt-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                            <Navigation className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-orange-700">Location access denied</p>
                                <p className="text-[11px] text-orange-600 mt-0.5">Please allow location access in your browser settings and try again.</p>
                            </div>
                        </div>
                    )}

                    {/* Mobile suggestions */}
                    {showSuggestions && suggestions?.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl z-50 max-h-52 overflow-y-auto">
                            {suggestions.map((s: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => selectSuggestion(s)}
                                    className="w-full px-3 py-2.5 flex items-center gap-2 text-left border-b border-zinc-100 last:border-none"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                    <div>
                                        <p className="text-sm text-zinc-900">{s.mainText}</p>
                                        <p className="text-[11px] text-zinc-500">{s.secondaryText}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search button */}
                <button
                    onClick={() => onSearch?.(value, localLocation)}
                    className="w-full bg-black text-white text-sm font-semibold rounded-xl h-11"
                >
                    Search
                </button>
            </div>

            {/* Backdrop */}
            {showSuggestions && (
                <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
            )}

            <LocationPermissionModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onAllow={handleAllowLocation}
                isLocating={isFetching}
            />
        </div>
    )
}
