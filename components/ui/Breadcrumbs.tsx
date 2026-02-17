"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Breadcrumb">
            <Link
                href="/"
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Home</span>
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span className="text-zinc-300">
                        <ChevronRight className="w-4 h-4" strokeWidth={3} />
                    </span>
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-zinc-900 font-bold">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
