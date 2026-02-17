"use client";

import React from 'react';

interface Tab {
    label: string;
    count?: number;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
    return (
        <div className="flex items-center gap-6 mb-6 border-b border-zinc-100 overflow-x-auto no-scrollbar whitespace-nowrap">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    onClick={() => onTabChange(tab.label)}
                    className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === tab.label ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                        }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-2 text-xs font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {tab.count}
                        </span>
                    )}
                    {activeTab === tab.label && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;
