import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ServiceOption {
    duration: string;
    price: number;
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
    step: 'services' | 'schedule' | 'details' | 'payment';
    selectedServices: { serviceId: string | number; optionIdx: number }[];
    availableServices: Service[];
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
                price: opt.price || opt.amount || 0
            }))
            : (service?.price !== undefined ? [{ duration: `${service.duration || 60} Mins`, price: service.price }] : []);

        const option = options[s.optionIdx];
        return { name: service?.name, price: option?.price, duration: option?.duration };
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

    const showActionButton = true;

    return (
        <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-28">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Booking Summary</h3>

                <div className="space-y-4">
                    {selectedServiceDetails.length > 0 ? (
                        <div className="space-y-2">
                            {selectedServiceDetails.map((s, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div>
                                        <span className="font-medium text-gray-800">{s.name}</span>
                                        <span className="text-xs text-gray-400 ml-1.5">{s.duration}</span>
                                    </div>
                                    <span className="font-semibold text-zinc-900">₹{s.price?.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div className="h-px bg-gray-100 my-3" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Total</span>
                                <span className="text-base font-bold text-zinc-900">
                                    ₹{totalPrice.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No services selected yet.</p>
                    )}

                    {selectedDate && selectedTime && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Slot</p>
                            <p className="text-sm font-medium text-gray-800">{selectedDate} · {selectedTime}</p>
                        </div>
                    )}

                    {paymentMethod && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Payment</p>
                            <p className="text-sm font-medium text-gray-800 capitalize">{paymentMethod === 'cash' ? 'Cash at Venue' : 'Online Payment'}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="pt-2 flex flex-col gap-2">
                        {showActionButton && (
                            <button
                                disabled={!isNextEnabled || isSubmitting}
                                onClick={step === 'payment' ? onConfirm : onNext}
                                className={`w-full h-11 rounded-lg text-sm font-semibold ${isNextEnabled ? 'bg-black text-white hover:bg-zinc-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? 'Processing...' : actionButtonText}
                            </button>
                        )}

                        {step !== 'services' && (
                            <button
                                onClick={onBack}
                                className="w-full h-10 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 hover:border-gray-300"
                            >
                                Back
                            </button>
                        )}
                    </div>
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

