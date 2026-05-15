"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { truncateToWords } from '@/lib/blog-utils';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    /** On viewports below `sm`, show only the first N words plus "..." (use for long titles). */
    mobileTruncateWords?: number;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium sm:text-sm" aria-label="Breadcrumb">
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
                    ) : item.mobileTruncateWords != null ? (
                        <span className="min-w-0 max-w-[min(100%,14rem)] text-zinc-900 font-semibold sm:max-w-none">
                            <span className="sm:hidden">{truncateToWords(item.label, item.mobileTruncateWords)}</span>
                            <span className="hidden sm:inline">{item.label}</span>
                        </span>
                    ) : (
                        <span className="line-clamp-2 max-w-[min(100%,18rem)] break-words text-zinc-900 font-semibold sm:max-w-none sm:line-clamp-none">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
