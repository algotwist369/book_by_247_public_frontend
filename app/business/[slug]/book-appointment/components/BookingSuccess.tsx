import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MapPin, Calendar, Clock, Receipt } from 'lucide-react';
import { Business } from '@/components/business/businessData';

interface BookingSuccessProps {
    business: Business;
    selectedTime: string;
    servicesCount: number;
    totalPrice: number;
    selectedServiceDetails: { name?: string; duration?: string }[];
    confirmationCode: string;
}

const BookingSuccess = ({
    business,
    selectedTime,
    servicesCount,
    totalPrice,
    selectedServiceDetails,
    confirmationCode
}: BookingSuccessProps) => {
    return (
        <div className="max-w-xl mx-auto space-y-6 pb-12">
            {/* Header Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center space-y-6 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#008080]" />

                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce-slow">
                        <CheckCircle2 className="w-12 h-12 stroke-[2.5px]" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Booking Confirmed!</h2>
                    <p className="text-gray-500 text-sm max-w-[280px] mx-auto">
                        Your appointment at <span className="font-bold text-gray-800">{business.name}</span> is all set.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 pt-2">
                    <div className="px-6 py-3 bg-zinc-50 border border-zinc-100 rounded-xl flex flex-col items-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Confirmation Code</span>
                        <span className="text-2xl font-black text-zinc-900 tracking-wider font-mono">{confirmationCode}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium">Please show this code at the venue</p>
                </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-4">Appointment Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-zinc-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Location</p>
                                <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">{business.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{business.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-zinc-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Date & Time</p>
                                <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">{selectedTime}, Today</p>
                                <p className="text-xs text-gray-500 mt-0.5">Please arrive 5 mins early</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Receipt className="w-4 h-4 text-zinc-400" />
                        <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Pricing Summary</h3>
                    </div>
                    <div className="space-y-3">
                        {selectedServiceDetails.map((service, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-zinc-100 shadow-sm">
                                <span className="text-sm font-bold text-gray-900">{service.name}</span>
                                <span className="text-xs font-medium text-gray-400">{service.duration}</span>
                            </div>
                        ))}
                        <div className="pt-4 flex justify-between items-center border-t border-zinc-100 mt-4">
                            <span className="text-sm font-black text-gray-900 uppercase">Total Amount</span>
                            <span className="text-2xl font-black text-[#008080]">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/" className="flex-1">
                    <button className="w-full h-12 bg-zinc-900 text-white rounded-lg text-sm font-bold hover:bg-zinc-800 transition-colors">
                        Return Home
                    </button>
                </Link>
                <Link href={`/business/${business.slug}`} className="flex-1">
                    <button className="w-full h-12 bg-white text-zinc-900 border border-zinc-200 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-colors">
                        View Profile
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccess;

