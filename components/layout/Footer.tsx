"use client";

import Link from "next/link";
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-zinc-950 rounded-sm" />
                            </div>
                            SPAADVISOR
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Your ultimate destination for discovering and booking the most premium spas and salons. Experience wellness at your fingertips.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Categories Column */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Top Categories</h3>
                        <ul className="space-y-4">
                            {['Spa & Wellness', 'Hair Salons', 'Massage Therapy', 'Nail Care', 'Facial & Skin'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Quick Links</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Contact Us', 'Become a Partner', 'Careers', 'Blog'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Stay Updated</h3>
                        <p className="text-sm">Subscribe to get special offers and wellness tips.</p>
                        <div className="space-y-3">
                            <Input
                                placeholder="Email address"
                                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                            />
                            <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Contact Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Call Us</p>
                            <p className="text-sm text-white font-medium">+1 (555) 000-1234</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Email Us</p>
                            <p className="text-sm text-white font-medium">hello@spaadvisor.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Visit Us</p>
                            <p className="text-sm text-white font-medium">123 Wellness St, Beauty City</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs">
                        © {currentYear} SpaAdvisor. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-xs hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-xs hover:text-white transition-colors">Cookies Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
