"use client"

import { useState } from "react"
import Modal from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useBlogAuth } from "@/hooks/useBlogAuth"

interface ReaderPopupProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
}

export function ReaderPopup({
    isOpen,
    onClose,
    title = "Create your reader account",
    description = "Save articles, like posts, join discussions, and sync reading activity.",
}: ReaderPopupProps) {
    const { login, register } = useBlogAuth()
    const [mode, setMode] = useState<"login" | "register">("register")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        try {
            setError("")
            if (mode === "login") {
                await login(email, password)
            } else {
                await register(name, email, password)
            }
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="rounded-[2rem] bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Reader access</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>

                <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1">
                    <button onClick={() => setMode("register")} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "register" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"}`}>Sign up</button>
                    <button onClick={() => setMode("login")} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "login" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"}`}>Login</button>
                </div>

                <div className="mt-6 space-y-4">
                    {mode === "register" ? (
                        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
                    ) : null}
                    <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
                    <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    <Button onClick={handleSubmit} className="w-full">
                        {mode === "login" ? "Continue with Email" : "Create account"}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
