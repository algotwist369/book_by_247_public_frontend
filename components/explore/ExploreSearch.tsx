import React from 'react';
import { Search } from 'lucide-react';

interface ExploreSearchProps {
    value: string;
    onChange: (value: string) => void;
}

const ExploreSearch = ({ value, onChange }: ExploreSearchProps) => {
    return (
        <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#008080] transition-colors">
                <Search className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by name, location or treatment..."
                className="w-full h-14 pl-14 pr-6 bg-zinc-50 border-2 border-transparent focus:border-[#008080]/20 focus:bg-white rounded-2xl outline-none text-zinc-900 font-bold placeholder:text-zinc-400 placeholder:font-medium transition-all"
            />
        </div>
    );
};

export default ExploreSearch;
