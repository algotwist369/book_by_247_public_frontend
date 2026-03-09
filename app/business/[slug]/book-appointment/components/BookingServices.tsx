import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ServiceOption {
    duration: string;
    price: number;
}

export interface Service {
    _id?: string;
    id?: number | string;
    name: string;
    description?: string;
    rating?: number;
    image?: string;
    options: ServiceOption[];
    pricingType?: string;
    price?: number;
    duration?: number;
}

interface BookingServicesProps {
    services: Service[];
    selectedServices: { serviceId: string | number; optionIdx: number }[];
    onToggleService: (serviceId: string | number, optionIdx: number) => void;
}

const ServiceCard = ({
    service,
    selectedOptions,
    onToggle
}: {
    service: Service;
    selectedOptions: number[];
    onToggle: (optionIdx: number) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Normalize options: check for options, pricingOptions, variations, or flat price
    // API might return 'variations' or 'pricingOptions'
    const rawOptions = service.options || (service as any).pricingOptions || (service as any).variations || [];

    let options: ServiceOption[] = [];

    if (rawOptions.length > 0) {
        options = rawOptions.map((opt: any) => ({
            duration: opt.duration ? `${opt.duration} Mins` : (opt.time ? `${opt.time} Mins` : (service.duration ? `${service.duration} Mins` : "60 Mins")),
            price: opt.price || opt.amount || 0
        }));
    } else if (service.price !== undefined) {
        options = [{ duration: `${service.duration || 60} Mins`, price: service.price }];
    } else {
        // Fallback for debugging - show even if incomplete
        options = [{ duration: "Duration TBD", price: 0 }];
    }

    // if (options.length === 0) return null; // Relaxed for debugging

    // Use _id or id
    const serviceId = service._id || service.id;

    return (
        <div className="border border-zinc-100 rounded-2xl overflow-hidden bg-white hover:border-zinc-200 transition-colors group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900/5 group-hover:text-black transition-colors shrink-0">
                        <Star className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 text-sm sm:text-base group-hover:text-black transition-colors leading-tight">{service.name}</h3>
                        <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 max-w-[200px] truncate">{service.description || "Service"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                        <span className="block font-black text-zinc-900 text-sm sm:text-base leading-none">
                            ₹{options[0]?.price.toLocaleString('en-IN')}
                        </span>
                        {options.length > 1 && <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">onwards</span>}
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-zinc-900/10 text-black' : 'text-zinc-300'}`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
            </button>


            {isOpen && (
                <div className="overflow-hidden bg-zinc-50/50">
                    <div className="p-4 sm:p-5 pt-0 space-y-3">
                        <div className="h-px bg-zinc-100 mb-4" />
                        {options.map((option, idx) => {
                            const isSelected = selectedOptions.includes(idx);
                            return (
                                <div key={idx} className={`flex flex-col xs:flex-row items-start xs:items-center justify-between p-3 rounded-xl bg-white border transition-colors gap-3 ${isSelected ? 'border-black/50 bg-zinc-50' : 'border-zinc-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-zinc-700 text-sm sm:text-base">{option.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between xs:justify-end gap-4 w-full xs:w-auto pt-2 xs:pt-0 border-t xs:border-0 border-zinc-50">
                                        <span className="font-bold text-zinc-900 text-sm sm:text-base">₹{option.price.toLocaleString('en-IN')}</span>
                                        <Button
                                            size="sm"
                                            onClick={() => onToggle(idx)}
                                            className={`${isSelected ? 'bg-black' : 'bg-zinc-900'} text-white hover:opacity-90 transition-colors px-5 sm:px-6 rounded-full font-bold h-8 sm:h-9 text-xs sm:text-sm flex items-center gap-2`}
                                        >
                                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                            {isSelected ? 'Selected' : 'Select'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const BookingServices = ({ services, selectedServices, onToggleService }: BookingServicesProps) => {
    return (
        <div className="bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 space-y-8">
            <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Select Services</h2>
                <p className="text-zinc-500 text-sm mt-1">Choose the treatments you'd like to book</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {(!services || services.length === 0) ? (
                    <div className="text-center p-8 bg-zinc-50 rounded-2xl">
                        <p className="text-zinc-500 font-medium">No services available for this business.</p>
                    </div>
                ) : (
                    services.map((service) => {
                        const serviceId = service._id || service.id!;
                        const selectedOptionsForService = selectedServices
                            .filter(s => s.serviceId === serviceId)
                            .map(s => s.optionIdx);

                        return (
                            <ServiceCard
                                key={String(serviceId)}
                                service={service}
                                selectedOptions={selectedOptionsForService}
                                onToggle={(optionIdx) => onToggleService(serviceId, optionIdx)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BookingServices;
