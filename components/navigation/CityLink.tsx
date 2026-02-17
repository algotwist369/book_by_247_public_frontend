import * as React from "react"
import Link from "next/link"
// import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CityLinkProps {
    name: string
    href: string
    className?: string
    onClick?: () => void
}

export const CityLink: React.FC<CityLinkProps> = ({ name, href, className, onClick }) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-1 text-sm text-zinc-600 hover:text-black transition-colors font-medium px-2 py-1",
                className
            )}
        >
            {name}
            {/* <ChevronDown className="w-4 h-4 text-zinc-400" /> */}
        </Link>
    )
}
