"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const DropdownSection = ({ title, icon, children }: DropdownSectionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-zinc-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors"
                type="button"
            >
                <div className="flex items-center gap-3 font-bold text-zinc-900">
                    {icon}
                    <span>{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropdownSection;
