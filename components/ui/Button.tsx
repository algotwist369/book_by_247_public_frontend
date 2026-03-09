import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-black text-white hover:bg-zinc-800 shadow-sm active:scale-[0.98]",
            secondary: "bg-zinc-100 text-black hover:bg-zinc-200 active:scale-[0.98]",
            outline: "border border-zinc-200 bg-transparent hover:bg-zinc-50 active:scale-[0.98]",
            ghost: "bg-transparent hover:bg-zinc-100",
            success: "bg-black text-white hover:bg-zinc-800 shadow-sm active:scale-[0.98]",
            danger: "bg-zinc-700 text-white hover:bg-zinc-800 shadow-sm active:scale-[0.98]",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs sm:h-9 sm:text-sm rounded-md",
            md: "h-10 px-4 text-sm sm:h-11 sm:px-5 sm:text-base rounded-lg",
            lg: "h-12 px-6 text-base sm:h-13 sm:px-8 sm:text-lg rounded-xl",
            icon: "h-10 w-10 sm:h-11 sm:w-11 rounded-full",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
