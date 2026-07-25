"use client"

import { useState, type FormEvent, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useBlogAuth } from "@/hooks/useBlogAuth"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { resetPassword } = useBlogAuth()

    const token = searchParams.get("token") || ""
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!token) {
            setStatus("error")
            setMessage("Missing password reset token in URL.")
            return
        }
        if (password !== confirmPassword) {
            setStatus("error")
            setMessage("Passwords do not match.")
            return
        }
        if (password.length < 6) {
            setStatus("error")
            setMessage("Password must be at least 6 characters long.")
            return
        }

        setStatus("loading")
        setMessage("")

        try {
            await resetPassword({ token, password })
            setStatus("success")
            setMessage("Password reset successfully! Redirecting...")
            setTimeout(() => {
                router.push("/blog")
            }, 2000)
        } catch (err: any) {
            setStatus("error")
            setMessage(err.message || "Password reset failed. Token may be invalid or expired.")
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-sm text-red-600 font-medium">Invalid or missing reset token.</p>
                <Link href="/blog/auth/forgot-password" className="mt-4 inline-block text-xs font-semibold text-black underline">
                    Request a new reset link
                </Link>
            </div>
        )
    }

    return (
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
                <label htmlFor="pass" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    New Password
                </label>
                <input
                    id="pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
            </div>

            <div>
                <label htmlFor="confirmPass" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Confirm Password
                </label>
                <input
                    id="confirmPass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
            </div>

            <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition-colors"
            >
                {status === "loading" ? "Resetting password..." : "Reset Password"}
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Set New Password</h1>
                    <p className="mt-2 text-sm text-gray-600">Please choose a new secure password for your reader account.</p>
                </div>
                <Suspense fallback={<div className="py-8 text-center text-sm text-gray-500">Loading token...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
