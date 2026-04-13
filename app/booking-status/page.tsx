"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const BookingStatusHomePage = () => {
    const router = useRouter();
    const [confirmationCode, setConfirmationCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = confirmationCode.trim();

        if (!code) {
            setError("Please enter your confirmation code.");
            return;
        }

        if (!/^[a-zA-Z0-9-_]+$/.test(code)) {
            setError("Please enter a valid confirmation code.");
            return;
        }

        setError("");
        router.push(`/booking-status/${encodeURIComponent(code)}`);
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
                <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-7">
                    <div className="flex items-center gap-2 mb-2">
                        <Search className="w-4 h-4 text-zinc-600" />
                        <p className="text-xs uppercase tracking-wide text-zinc-500">Track Booking</p>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">Check Your Booking Status</h1>
                    <p className="text-sm text-zinc-600 mt-2">
                        Enter your confirmation code to view your appointment status and details.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                        <label className="block text-sm font-medium text-zinc-700">
                            Confirmation Code
                        </label>
                        <input
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            placeholder="e.g. 202604133081"
                            className="w-full h-11 px-3 rounded-md border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500"
                        />
                        {error && <p className="text-xs text-red-600">{error}</p>}
                        <Button type="submit" className="w-full" size="sm">
                            View Booking Status
                        </Button>
                    </form>

                    <p className="text-xs text-zinc-500 pt-4">
                        Need help? Contact support@bookby247.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingStatusHomePage;

