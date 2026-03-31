import Link from "next/link";
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // 🔥 DATA
    const socialLinks = [
        { icon: Instagram, label: "Instagram" },
        { icon: Facebook, label: "Facebook" },
        { icon: Twitter, label: "Twitter" },
        { icon: Linkedin, label: "LinkedIn" }
    ];

    const categories = [
        "Spa & Wellness",
        "Hair Salons",
        "Massage Therapy",
        "Nail Care",
        "Facial & Skin"
    ];

    const quickLinks = [
        "About Us",
        "Contact Us",
        "Become a Partner",
        "Careers",
        "Blog"
    ];

    const bottomLinks = [
        "Privacy Policy",
        "Terms of Service",
        "Cookies Settings"
    ];

    const renderLinks = (links: any[]) =>
        links.map((item) => (
            <li key={item}>
                <Link
                    href="#"
                    className="text-sm hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                </Link>
            </li>
        ));

    return (
        <footer className="bg-zinc-950 text-zinc-400 border-t border-white/5 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 🔥 TOP GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="space-y-5">
                        <Link href="/" className="shrink-0 flex items-center">
                            <img
                                src="https://res.cloudinary.com/dwsv275kv/image/upload/v1774690800/WhatsApp_Image_2026-03-28_at_3_imgupscaler.ai_General_8K_x8h19z.jpg" // put your logo inside public folder
                                alt="SPA ADVISOR Logo"
                                width={180}
                                height={60}
                                // priority
                                className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-lg"
                            />
                        </Link>

                        <p className="text-sm max-w-xs">
                            Discover and book premium spas and salons. Wellness at your fingertips.
                        </p>

                        {/* Social */}
                        <div className="flex gap-3 flex-wrap">
                            {socialLinks.map(({ icon: Icon, label }) => (
                                <Link
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 🔥 Categories + Quick Links (2 COL ON MOBILE) */}
                    <div className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-2">

                        {/* Categories */}
                        <div className="space-y-5">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                                Top Categories
                            </h3>
                            <ul className="space-y-3">
                                {renderLinks(categories)}
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-5">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                {renderLinks(quickLinks)}
                            </ul>
                        </div>

                    </div>

                    {/* Newsletter */}
                    <div className="space-y-5">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                            Stay Updated
                        </h3>
                        <p className="text-sm">
                            Get offers & wellness tips directly.
                        </p>

                        <div className="space-y-3">
                            <Input
                                placeholder="Email address"
                                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                            />
                            <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 🔥 CONTACT */}
                <div className="border-y border-white/5 py-6 mt-10 text-center md:text-left">
                    <p className="text-sm text-white">
                        Support: support@bookby247.com
                    </p>
                </div>

                {/* 🔥 BOTTOM BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-center md:text-left">
                    <p className="text-xs">
                        © {currentYear} Bookby247. All rights reserved.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-end gap-5">
                        {bottomLinks.map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-xs hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;