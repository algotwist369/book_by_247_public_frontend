"use client"

import React, { Component, ReactNode } from "react"

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

export class BlogErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    }

    public static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("[BlogErrorBoundary] Caught error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }
            return (
                <div className="my-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-800">
                    <p className="font-medium">Blog section unavailable</p>
                    <p className="mt-1 text-xs opacity-80">This component experienced a temporary issue.</p>
                </div>
            )
        }

        return this.props.children
    }
}
