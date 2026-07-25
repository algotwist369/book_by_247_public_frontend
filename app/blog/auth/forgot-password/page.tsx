"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useBlogAuth } from "@/hooks/useBlogAuth"

export default function ForgotPasswordPage() {
    const { forgotPassword } = useBlogAuth()
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setStatus("loading")
        setMessage("")

        try {
            await forgotPassword(email)
            setStatus("success")
            setMessage("If an account exists for this email, password reset instructions have been sent.")
        } catch (err: any) {
            setStatus("error")
            setMessage(err.message || "Failed to send reset email. Please try again.")
        }
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Forgot Password</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your registered email address to receive password reset instructions.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {message && (
                        <div
                            className={`rounded-xl p-4 text-sm ${
                                status === "success"
                                    ? "bg-green-50 border border-green-200 text-green-800"
                                    : "bg-red-50 border border-red-200 text-red-800"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        {status === "loading" ? "Sending instructions..." : "Send Reset Link"}
                    </button>

                    <div className="text-center pt-2">
                        <Link href="/blog" className="text-xs font-medium text-gray-600 hover:text-black">
                            &larr; Back to Blog
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
