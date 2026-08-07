import Link from "next/link";
import Image from "next/image";
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

    const socialLinks = [
        { icon: Instagram, label: "Instagram", Link: "https://www.instagram.com/bookby247" },
        { icon: Facebook, label: "Facebook", Link: "https://www.facebook.com/bookby247" },
        { icon: Twitter, label: "Twitter", Link: "https://twitter.com/bookby247" },
        { icon: Linkedin, label: "LinkedIn", Link: "https://www.linkedin.com/company/bookby247" }
    ];

    const categories = [
        { label: "Spa & Wellness", href: "/explore?category=spa%20%26%20wellness" },
        { label: "Hair Salons", href: "/explore?category=hair%20salons" },
        { label: "Massage Therapy", href: "/explore?category=massage%20therapy" },
        { label: "Nail Care", href: "/explore?category=nail%20care" },
        { label: "Facial & Skin", href: "/explore?category=facial%20%26%20skin" }
    ];

    const quickLinks = [
        { label: "About BookBy247", href: "/#about-bookby247" },
        { label: "Services", href: "/explore" },
        { label: "Contact Us", href: "mailto:support@bookby247.com" },
        { label: "Become a Partner", href: "/free-listing" },
        { label: "Careers", href: "/careers" },
    ];

    const bottomLinks = [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Editorial Standards", href: "/editorial-standards" },
        { label: "Cookies Settings", href: "/cookies-settings" }
    ];

    const renderLinks = (links: Array<{ label: string; href: string }>) =>
        links.map((item) => (
            <li key={item.label}>
                <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.label}
                </Link>
            </li>
        ));

    return (
        <footer className="bg-zinc-950 text-zinc-400 border-t border-white/5 py-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* TOP GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-5">
                        <Link href="/" className="shrink-0 flex items-center" aria-label="BookBy247 Home">
                            <div className="relative h-10 sm:h-12 md:h-14 w-[120px] sm:w-[144px] md:w-[168px] aspect-[3/1] shrink-0">
                                <Image
                                    src="https://res.cloudinary.com/dwsv275kv/image/upload/f_auto,q_auto,w_360/v1774690800/WhatsApp_Image_2026-03-28_at_3_imgupscaler.ai_General_8K_x8h19z.jpg"
                                    alt="BOOKBY247 Logo"
                                    width={180}
                                    height={60}
                                    className="h-full w-full object-contain rounded-lg"
                                />
                            </div>
                        </Link>

                        <p className="text-sm max-w-xs text-zinc-300">
                            Discover and book premium spas and salons. Wellness at your fingertips.
                        </p>

                        {/* Social */}
                        <div className="flex gap-3 flex-wrap">
                            {socialLinks.map(({ icon: Icon, label, Link: socialHref }) => (
                                <Link
                                    key={label}
                                    href={socialHref}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

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

                    {/* Newsletter */}
                    <div className="space-y-5">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-zinc-300">
                            Get offers & wellness tips directly.
                        </p>

                        <div className="space-y-3">
                            <Input
                                placeholder="Email address"
                                aria-label="Email address for newsletter"
                                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                            />
                            <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CONTACT */}
                <div className="border-y border-white/10 py-6 mt-10 text-center md:text-left">
                    <p className="text-sm text-zinc-300">
                        Need help? - <a href="mailto:support@bookby247.com" className="text-white underline hover:text-zinc-300 transition-colors">support@bookby247.com</a>
                    </p>
                </div>

                {/* BOTTOM BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-center md:text-left text-zinc-400">
                    <p className="text-xs">
                        © {currentYear} BookBy247. All rights reserved.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-end gap-5">
                        {bottomLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-xs hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
