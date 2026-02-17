"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StateCardProps {
    state: {
        id: string;
        label: string;
        image: string;
    };
    onClick: (label: string) => void;
}

export const StateCard: React.FC<StateCardProps> = React.memo(({ state, onClick }) => {
    return (
        <button
            onClick={() => onClick(state.label)}
            className="flex flex-col items-center gap-4 group focus:outline-none flex-shrink-0 snap-center"
        >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-zinc-100 transition-all hover:border-zinc-900 active:scale-95">
                <img
                    src={state.image}
                    alt={state.label}
                    width={120}
                    height={120}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
            </div>
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors">
                {state.label}
            </span>
        </button>
    );
});

StateCard.displayName = "StateCard";
