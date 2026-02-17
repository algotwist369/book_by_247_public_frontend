import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
    href?: string;
    onClick?: () => void;
    label?: string;
    className?: string;
}

const BackButton = ({ href, onClick, label = "Back", className = "" }: BackButtonProps) => {
    const content = (
        <>
            <ChevronLeft className="w-4 h-4" />
            <span>{label}</span>
        </>
    );

    const baseStyles = "flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors font-bold text-xs uppercase tracking-wider";

    if (href) {
        return (
            <Link href={href} className={`${baseStyles} ${className}`}>
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${className}`}
        >
            {content}
        </button>
    );
};

export default BackButton;
