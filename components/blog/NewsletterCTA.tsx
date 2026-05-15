"use client"

import { useState } from "react"
import { blogApi } from "@/api/public/blog"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export function NewsletterCTA() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState("")

    return (
        <section className="border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-sm font-medium text-zinc-900">Newsletter</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">Occasional updates. No spam.</p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email"
                    className="h-9 flex-1 rounded-md border-gray-200 bg-white text-[14px] text-gray-900 shadow-none outline-none focus-visible:border-gray-400 focus-visible:ring-0"
                />
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await blogApi.subscribeNewsletter(email)
                            setStatus("Thanks - you’re subscribed.")
                            setEmail("")
                        } catch {
                            setStatus("Something went wrong. Try again.")
                        }
                    }}
                    className="h-9 shrink-0 rounded-md bg-zinc-900 px-4 text-[14px] font-medium text-white hover:bg-zinc-800"
                >
                    Join
                </Button>
            </div>
            {status ? <p className="mt-2 text-[12px] text-zinc-600">{status}</p> : null}
        </section>
    )
}
