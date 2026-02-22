"use client"

import React from 'react'
import { SearchBar } from '../ui/SearchBar'
import { useRouter } from 'next/navigation'

// Isolated client component — only the router-dependent part
export const HeroSearch = () => {
    const router = useRouter()

    const handleSearch = (q?: string, loc?: string) => {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (loc) params.set('location', loc)
        router.push(`/explore?${params.toString()}`)
    }

    return (
        <div className="flex justify-center pt-2 md:pt-4">
            <SearchBar onSearch={handleSearch} />
        </div>
    )
}
