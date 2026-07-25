"use client"

import Link from "next/link"
import { Eye, Edit3, Settings, CheckCircle2 } from "lucide-react"

interface WpEditorHeaderProps {
    title: string
    isEditMode: boolean
    onToggleMode: (mode: "edit" | "preview") => void
    wordCount: number
    readingTimeMinutes: number
    isSubmitting: boolean
    onPublish: () => void
    isSidebarOpen: boolean
    onToggleSidebar: () => void
    isUpdate?: boolean
}

export function WpEditorHeader({
    title,
    isEditMode,
    onToggleMode,
    wordCount,
    readingTimeMinutes,
    isSubmitting,
    onPublish,
    isSidebarOpen,
    onToggleSidebar,
    isUpdate = false,
}: WpEditorHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur px-4 py-2.5 sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                {/* Left: Navigation & Status */}
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href="/blog"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                        title="Back to Blog"
                    >
                        &larr;
                    </Link>

                    <div className="hidden sm:block min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-gray-900">
                                {title.trim() || "Untitled Article"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" /> Saved
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: Word Count & Reading Time */}
                <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <span>{wordCount} words</span>
                    <span>·</span>
                    <span>{readingTimeMinutes} min read</span>
                </div>

                {/* Right: Actions & Controls */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Switcher Edit / Preview */}
                    <div className="flex rounded-lg bg-gray-100 p-1">
                        <button
                            type="button"
                            onClick={() => onToggleMode("edit")}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                isEditMode ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                            }`}
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleMode("preview")}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                !isEditMode ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                            }`}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Preview</span>
                        </button>
                    </div>

                    {/* Toggle Settings Drawer */}
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                            isSidebarOpen
                                ? "border-black bg-black text-white"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                        title="Post Settings Inspector"
                    >
                        <Settings className="h-4 w-4" />
                    </button>

                    {/* Publish / Update Button */}
                    <button
                        type="button"
                        onClick={onPublish}
                        disabled={isSubmitting}
                        className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isSubmitting
                            ? isUpdate
                                ? "Saving..."
                                : "Publishing..."
                            : isUpdate
                            ? "Update Post"
                            : "Publish Post"}
                    </button>
                </div>
            </div>
        </header>
    )
}
