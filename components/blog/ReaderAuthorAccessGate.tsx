"use client"

import { useState } from "react"
import Link from "next/link"
import { blogApi } from "@/api/public/blog"
import { useBlogAuth } from "@/hooks/useBlogAuth"

export function ReaderAuthorAccessGate() {
    const { user, refreshProfile } = useBlogAuth()
    const [submitting, setSubmitting] = useState(false)
    const [reason, setReason] = useState("")
    const [submitted, setSubmitted] = useState(user?.authorRequestStatus === "pending")
    const [error, setError] = useState("")

    const handleRequestAccess = async () => {
        setSubmitting(true)
        setError("")

        try {
            await blogApi.requestAuthorAccess(reason)
            await refreshProfile()
            setSubmitted(true)
        } catch (err: any) {
            setError(err.message || "Failed to submit request. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-3xl">
                    ✍️
                </div>

                <div>
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
                        Reader Account Privileges
                    </span>
                    <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                        Author Writing Access Required
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        Your account currently has <strong className="text-black font-semibold">Reader</strong> access.
                        To publish or draft articles on the BookBy247 Editorial Platform, your account must be approved as an Author or Editor by the site admin.
                    </p>
                </div>

                {submitted ? (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-left space-y-2">
                        <div className="flex items-center space-x-2 text-green-900 font-bold text-sm">
                            <span>✓</span>
                            <span>Request Sent to Site Administrator</span>
                        </div>
                        <p className="text-xs text-green-800 leading-relaxed">
                            An email notification has been dispatched via AWS SES to the BookBy247 Admin. Once approved, your writing capabilities will be unlocked automatically.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 pt-2">
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                                {error}
                            </div>
                        )}

                        <textarea
                            rows={2}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Optional: Tell the admin what topics you plan to write about..."
                            className="block w-full rounded-xl border border-gray-300 p-3 text-xs focus:border-black focus:outline-none"
                        />

                        <button
                            onClick={handleRequestAccess}
                            disabled={submitting}
                            className="w-full rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {submitting ? "Sending Request to Admin..." : "Request Author Access from Admin"}
                        </button>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <Link href="/blog" className="font-semibold text-gray-700 hover:text-black">
                        &larr; Back to Articles
                    </Link>
                    <Link href="/blog/profile" className="font-semibold text-gray-700 hover:text-black">
                        View Profile Settings &rarr;
                    </Link>
                </div>
            </div>
        </div>
    )
}
