import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import { Business } from '@/components/business/businessData';
import BackButton from './BackButton';


interface BookingHeaderProps {
    business: Business;
}

const BookingHeader = ({ business }: BookingHeaderProps) => {
    return (
        <div className="bg-white border-b border-zinc-100 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                <BackButton href={`/business/${business.slug}`} />


                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <h1 className="text-xs sm:text-sm font-black text-zinc-900 leading-tight truncate max-w-[150px] sm:max-w-none">{business.name}</h1>
                        <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                            <Star className="w-2 h-2 text-yellow-400 fill-current" />
                            <span>{business.rating} • {business.reviews} Reviews</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BookingHeader;
