"use client"

import { useState } from "react"
import { Sparkles, Wand2, X, AlertCircle, Check } from "lucide-react"
import type { BlogTaxonomy } from "@/lib/blog-types"

interface LuomoAiModalProps {
    isOpen: boolean
    onClose: () => void
    categories: BlogTaxonomy[]
    tags: BlogTaxonomy[]
    onStartGenerating: (payload: {
        title: string
        subtitle: string
        selectedCategoryIds: string[]
        selectedTagIds: string[]
        tone: string
        categoryNames: string[]
        tagNames: string[]
    }) => void
}

const TONE_OPTIONS = [
    { id: "engaging", label: "Engaging & Story-driven" },
    { id: "professional", label: "Professional & Authoritative" },
    { id: "informative", label: "SEO Informative & Detailed" },
    { id: "conversational", label: "Casual & Conversational" },
    { id: "technical", label: "Technical & Analytical" },
]

export function LuomoAiModal({
    isOpen,
    onClose,
    categories,
    tags,
    onStartGenerating,
}: LuomoAiModalProps) {
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
    const [tone, setTone] = useState("engaging")
    const [errorMsg, setErrorMsg] = useState("")

    if (!isOpen) return null

    const toggleCategory = (id: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const toggleTag = (id: string) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleGenerateClick = () => {
        if (!title.trim()) {
            setErrorMsg("Please enter an article title or core topic.")
            return
        }

        setErrorMsg("")

        // Map category IDs to names
        const categoryNames = categories
            .filter((c) => (c._id && selectedCategoryIds.includes(c._id)) || (c.id && selectedCategoryIds.includes(c.id)))
            .map((c) => c.name)

        // Map tag IDs to names
        const tagNames = tags
            .filter((t) => (t._id && selectedTagIds.includes(t._id)) || (t.id && selectedTagIds.includes(t.id)))
            .map((t) => t.name)

        onStartGenerating({
            title,
            subtitle,
            selectedCategoryIds,
            selectedTagIds,
            tone,
            categoryNames,
            tagNames,
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-500/20 my-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight text-white">Write with Luomo AI</h2>
                            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                                Admin Exclusive
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Provide inputs to launch live AI article generation on your canvas.
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                        <div>{errorMsg}</div>
                    </div>
                )}

                <div className="space-y-5">
                    {/* Article Title Input */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                            Article Title / Core Topic <span className="text-indigo-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 10 Essential SEO Strategies for Local Businesses in 2026"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Subtitle / Brief Textarea */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                            Subtitle or Article Brief (Optional)
                        </label>
                        <textarea
                            rows={3}
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Provide key points, target audience details, or specific sections you want Luomo to include..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Category Selection */}
                    {categories.length > 0 && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Select Categories
                            </label>
                            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                                {categories.map((cat) => {
                                    const catId = cat._id || cat.id || cat.slug
                                    const isSelected = selectedCategoryIds.includes(catId)
                                    return (
                                        <button
                                            key={catId}
                                            type="button"
                                            onClick={() => toggleCategory(catId)}
                                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                                isSelected
                                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                                            }`}
                                        >
                                            {isSelected && <Check className="h-3 w-3" />}
                                            <span>{cat.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tags Selection */}
                    {tags.length > 0 && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Select Tags
                            </label>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                                {tags.map((tag) => {
                                    const tagId = tag._id || tag.id || tag.slug
                                    const isSelected = selectedTagIds.includes(tagId)
                                    return (
                                        <button
                                            key={tagId}
                                            type="button"
                                            onClick={() => toggleTag(tagId)}
                                            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                                                isSelected
                                                    ? "bg-purple-600 text-white"
                                                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"
                                            }`}
                                        >
                                            #{tag.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tone Selection */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                            Writing Tone
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {TONE_OPTIONS.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setTone(t.id)}
                                    className={`rounded-xl border px-3 py-2 text-xs font-medium text-left transition-all ${
                                        tone === t.id
                                            ? "border-indigo-500 bg-indigo-950/60 text-indigo-200"
                                            : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generate Button Footer */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerateClick}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-90 transition-all"
                    >
                        <Wand2 className="h-4 w-4" />
                        <span>Generate Article on Canvas</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
