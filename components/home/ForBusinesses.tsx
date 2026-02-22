"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

const ForBusinesses = () => {
    const router = useRouter();

    return (
        <section className="max-w-360 mx-auto px-6 mt-10">
            <div className="bg-white border border-zinc-200 rounded-3xl">

                <div className="grid lg:grid-cols-12 gap-16 items-center p-10 md:p-14 lg:p-20">

                    {/* ================= LEFT CONTENT ================= */}
                    <div className="lg:col-span-6 space-y-8">

                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-300 rounded-full">
                                <span className="h-2 w-2 rounded-full bg-teal-600" />
                                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                                    Partner Growth
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                                Grow your spa salon <br />
                                <span className="text-teal-600">
                                    and beauty business.
                                </span>
                            </h2>

                            <p className="text-zinc-600 text-lg max-w-xl leading-relaxed">
                                Manage bookings, attract regular customers, and scale your
                                brand with an easy-to-use wellness management platform.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            {[
                                "Online booking management",
                                "Reach nearby customers",
                                "Performance tracking",
                                "24/7 Support",
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-teal-600" />
                                    <span className="text-zinc-700 text-sm font-medium">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">

                            <button
                                onClick={() => router.push("/free-listing")}
                                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base flex items-center justify-center gap-2"
                            >
                                List Your Business Free
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => router.push("/book-demo")}
                                className="px-6 py-3 rounded-xl border border-zinc-300 text-zinc-800 font-semibold text-base hover:bg-zinc-100"
                            >
                                Request a Demo
                            </button>

                        </div>

                        <div className="pt-4 border-t border-zinc-200">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                Joined by 12,000+ businesses nationwide
                            </p>
                        </div>

                    </div>

                    {/* ================= RIGHT SIDE ================= */}
                    <div className="lg:col-span-6">

                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">

                            {/* Browser Header */}
                            <div className="h-10 bg-zinc-50 border-b border-zinc-200 flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                            </div>

                            <CustomImage
                                src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771403175/free-listing_rczevw.png"
                                alt="Dashboard Mockup"
                                width={800}
                                height={600}
                                className="w-full h-auto object-cover"
                            />

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ForBusinesses;
