import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

const ForBusinesses = () => {

    return (
        <section className="mt-10 bg-linear-to-b from-white via-zinc-50/80 to-white max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl border border-zinc-200 bg-linear-to-br from-white via-zinc-50 to-rose-50/60">

                <div className="grid items-center gap-10 p-6 sm:p-10 md:grid-cols-12 md:gap-12 md:p-12">

                    {/* ================= LEFT CONTENT ================= */}
                    <div className="space-y-8 md:col-span-6">

                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1">
                                <span className="h-2 w-2 rounded-full bg-black" />
                                <span className="text-xs font-semibold text-zinc-700 uppercase tracking-widest">
                                    B2B SALON & SPA SOFTWARE & LISTING
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                                Grow Your Spa, Hair Salon & Beauty Parlour Business
                                <br />
                                <span className="text-zinc-900">
                                    with BookBy247 Partner Platform
                                </span>
                            </h2>

                            <p className="max-w-xl text-sm leading-relaxed text-zinc-700 sm:text-base">
                                Streamline online appointments, generate repeat salon clients, and increase salon revenue with an easy-to-use, all-in-one salon billing and scheduling software.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                            {[
                                "Real-Time Salon & Spa Calendar Sync",
                                "Hyper-Local Local SEO Marketing",
                                "Sales Analytics & Billing Software",
                                "24/7 Merchant Customer Support",
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-black" />
                                    <span className="text-sm font-medium text-zinc-800">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">

                            <a
                                href="https://business.bookby247.com/free-listing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-base font-semibold text-white"
                            >
                                List Your Salon & Spa Free
                                <ArrowRight className="w-4 h-4" />
                            </a>

                            <a
                                href="https://business.bookby247.com/book-demo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-center rounded-xl border border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-800"
                            >
                                Book Free Software Demo
                            </a>

                        </div>

                        <div className="border-t border-zinc-200 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                JOINED BY 12,000+ SALONS, SPAS & PARLOURS NATIONWIDE
                            </p>
                        </div>

                    </div>

                    {/* ================= RIGHT SIDE ================= */}
                    <div className="md:col-span-6">

                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">

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
