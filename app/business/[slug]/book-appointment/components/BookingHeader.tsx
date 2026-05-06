import React from 'react';
import { Business } from '@/components/business/businessData';
import BackButton from './BackButton';

interface BookingHeaderProps {
    business: Business;
    stepTitle?: string;
}

const BookingHeader = ({ business, stepTitle = 'Book Appointment' }: BookingHeaderProps) => {
    return (
        <div className="bg-white border-b border-zinc-100 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <BackButton href={`/business/${business.slug}`} />

                <h1 className="text-sm sm:text-base font-black text-zinc-900 tracking-tight">
                    {stepTitle}
                </h1>

                <div className="w-6 h-6" />
            </div>
        </div>
    );
};

export default BookingHeader;