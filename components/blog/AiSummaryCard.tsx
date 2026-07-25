"use client"

import { useEffect, useState } from "react"
import { blogApi } from "@/api/public/blog"
import type { AiArticleLlmPayload } from "@/lib/blog-types"

export function AiSummaryCard({ slug }: { slug: string }) {
    const [aiData, setAiData] = useState<AiArticleLlmPayload | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return
        blogApi.getAiArticleLlm(slug)
            .then((res) => {
                if (res.data) {
                    setAiData(res.data)
                }
            })
            .catch(() => {
                /* optional feature, ignore error */
            })
            .finally(() => setLoading(false))
    }, [slug])

    if (loading) return null
    if (!aiData?.summary && !aiData?.keyTakeaways?.length) return null

    return (
        <div className="my-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/60 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
                <span className="text-lg">✨</span>
                <span>AI Insights & Key Takeaways</span>
            </div>

            {aiData.summary && (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {aiData.summary}
                </p>
            )}

            {aiData.keyTakeaways && aiData.keyTakeaways.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-blue-100/80 pt-4">
                    {aiData.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs font-medium text-slate-700">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
