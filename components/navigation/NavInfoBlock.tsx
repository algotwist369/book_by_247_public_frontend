import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavInfoBlockProps {
    icon: LucideIcon
    title: string
    subtitle: string
    className?: string
}

export const NavInfoBlock: React.FC<NavInfoBlockProps> = ({
    icon: Icon,
    title,
    subtitle,
    className,
}) => {
    return (
        <div className={cn("flex items-center gap-3 px-4 py-2 border-r border-zinc-100 last:border-0 cursor-pointer hover:bg-zinc-50 transition-colors", className)}>
            <div className="shrink-0">
                <Icon className="w-6 h-6 text-zinc-400" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900 leading-tight">{title}</span>
                <span className="text-xs text-zinc-500 leading-tight">{subtitle}</span>
            </div>
        </div>
    )
}
