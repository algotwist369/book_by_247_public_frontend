"use client"

import React from 'react'
import { SearchBar } from '../ui/SearchBar'
import { useRouter } from 'next/navigation'
import { startRouteProgress } from '@/lib/navigation-events'

// Isolated client component - only the router-dependent part
export const HeroSearch = () => {
    const router = useRouter()

    const handleSearch = (q?: string, loc?: string) => {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (loc) params.set('location', loc)
        const href = `/explore?${params.toString()}`
        startRouteProgress(href)
        router.prefetch(href)
        router.push(href)
    }

    return (
        <div className="flex justify-center pt-2 md:pt-4">
            <SearchBar onSearch={handleSearch} />
        </div>
    )
}
