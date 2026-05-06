import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ServiceOption {
    duration: string;
    price: number;
    originalPrice?: number;
}

interface Service {
    _id?: string;
    id?: number | string;
    name: string;
    description?: string;
    rating?: number;
    options: ServiceOption[];
    price?: number;
    duration?: number;
}

interface BookingSummaryProps {
    step: 'services' | 'schedule' | 'details' | 'payment' | 'otp' | 'success';
    selectedServices: { serviceId: string | number; optionIdx: number; addOnIds: string[] }[];
    availableServices: Service[];
    businessName: string;
    selectedDate: string;
    selectedTime: string;
    formData: { name: string; phone: string };
    paymentMethod: 'cash' | 'online' | '';
    onNext: () => void;
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting?: boolean;
    error?: string | null;
}

const BookingSummary = ({
    step,
    selectedServices,
    availableServices,
    businessName,
    selectedDate,
    selectedTime,
    formData,
    paymentMethod,
    onNext,
    onBack,
    onConfirm,
    isSubmitting = false,
    error = null
}: BookingSummaryProps) => {
    const selectedServiceDetails = selectedServices.map(s => {
        const service = availableServices.find(as => (as._id || as.id) === s.serviceId);

        const rawOptions = service?.options || (service as any)?.pricingOptions || [];
        const options = rawOptions.length > 0
            ? rawOptions.map((opt: any) => ({
                duration: opt.duration ? `${opt.duration} Mins` : (opt.time ? `${opt.time} Mins` : (service?.duration ? `${service.duration} Mins` : "60 Mins")),
                price: opt.price || opt.amount || 0, // sellingPrice
                originalPrice: opt.originalPrice || 0 // previousPrice
            }))
            : (service?.price !== undefined ? [{ 
                duration: `${service.duration || 60} Mins`, 
                price: service.price, // sellingPrice
                originalPrice: (service as any).originalPrice || 0 // previousPrice
            }] : []);

        const option = options[s.optionIdx];
        const addOns = ((service as any)?.addOns || []).filter((addon: any) =>
            (s.addOnIds || []).includes(String(addon?._id))
        );
        const addOnsPrice = addOns.reduce((sum: number, addon: any) => sum + Number(addon?.price || 0), 0);
        return {
            name: service?.name,
            price: (option?.price || 0) + addOnsPrice,
            originalPrice: option?.originalPrice || 0,
            duration: option?.duration,
            addOns
        };
    });

    const totalPrice = selectedServiceDetails.reduce((acc, s) => acc + (s.price || 0), 0);

    const isNextEnabled =
        (step === 'services' && selectedServices.length > 0) ||
        (step === 'schedule' && selectedDate && selectedTime) ||
        (step === 'details' && formData.name && formData.phone) ||
        (step === 'payment' && paymentMethod !== '');

    const actionButtonText =
        step === 'services' ? 'Select Slot' :
            step === 'schedule' ? 'Continue' :
                step === 'details' ? 'Payment' :
                    step === 'payment' ? 'Confirm Booking' : '';


    const totalDuration = selectedServiceDetails.reduce((acc, s) => {
        const d = parseInt(s.duration || '0');
        return acc + (isNaN(d) ? 0 : d);
    }, 0);

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden sticky top-28 shadow-sm">
                <div className="p-5 border-b border-zinc-100">
                    <h3 className="text-lg font-bold text-zinc-900">Booking Summary</h3>
                </div>

                <div className="p-5 space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 font-medium">Business</span>
                            <span className="text-zinc-900 font-bold uppercase tracking-tight text-right ml-4">{businessName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 font-medium">Services Selected</span>
                            <span className="text-zinc-900 font-bold">{selectedServices.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 font-medium">Estimated Duration</span>
                            <span className="text-zinc-900 font-bold">{totalDuration > 0 ? `${totalDuration} Mins` : '--'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 font-medium">Estimated Price</span>
                            <span className="text-zinc-900 font-black text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-100 my-4" />

                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Selected Services:</p>
                        {selectedServiceDetails.length > 0 ? (
                            <div className="space-y-3">
                                {selectedServiceDetails.map((s, idx) => (
                                    <div key={idx} className="flex flex-col text-xs">
                                        <span className="font-bold text-zinc-800">{s.name}</span>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-zinc-400">{s.duration}</span>
                                            <div className="text-right flex items-center gap-1.5">
                                                {s.originalPrice > 0 && (
                                                    <span className="text-[10px] text-zinc-400 line-through">₹{s.originalPrice.toLocaleString('en-IN')}</span>
                                                )}
                                                <span className="font-bold text-zinc-900">₹{s.price?.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                        {s.addOns?.length > 0 && (
                                            <p className="text-[10px] text-zinc-400 mt-1 pl-2 border-l border-zinc-200">
                                                + {s.addOns.map((a: any) => a.name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-400 italic">No services selected yet.</p>
                        )}
                    </div>

                    {selectedDate && selectedTime && (
                        <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Slot Information</p>
                            <p className="text-xs font-bold text-zinc-800">{selectedDate} · {selectedTime}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-md p-3">
                            <p className="text-[10px] text-red-600 font-bold leading-tight">{error}</p>
                        </div>
                    )}

                    <button
                        disabled={!isNextEnabled || isSubmitting}
                        onClick={step === 'payment' ? onConfirm : onNext}
                        className={`w-full py-4 rounded-md font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                            isNextEnabled 
                                ? 'bg-zinc-900 text-white hover:bg-black' 
                                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'Processing...' : actionButtonText}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>

                    {step !== 'services' && (
                        <button
                            onClick={onBack}
                            className="w-full py-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest"
                        >
                            Go Back
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-white flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-gray-800">Verified by Bookby247</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        5.2k+ users booked here in the last 30 days. No advance payment required.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;

