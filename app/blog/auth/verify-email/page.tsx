"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { blogApi } from "@/api/public/blog"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token") || ""
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Verification token is missing in the URL.")
            return
        }

        blogApi.verifyEmail(token)
            .then(() => {
                setStatus("success")
                setMessage("Your email address has been verified successfully!")
            })
            .catch((err: any) => {
                setStatus("error")
                setMessage(err.message || "Email verification failed or token has expired.")
            })
    }, [token])

    return (
        <div className="text-center py-4">
            {status === "loading" && (
                <div className="space-y-4">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                    <p className="text-sm text-gray-600">Verifying your email address...</p>
                </div>
            )}

            {status === "success" && (
                <div className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                        ✓
                    </div>
                    <p className="text-sm font-medium text-green-800">{message}</p>
                    <Link
                        href="/blog"
                        className="inline-block rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                    >
                        Go to Blog Home
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                        ✕
                    </div>
                    <p className="text-sm font-medium text-red-800">{message}</p>
                    <Link
                        href="/blog"
                        className="inline-block rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                        Back to Blog
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">Email Verification</h1>
                <Suspense fallback={<div className="py-8 text-center text-sm text-gray-500">Loading...</div>}>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    )
}
