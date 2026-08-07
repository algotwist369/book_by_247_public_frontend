import React from 'react';
import { Banknote, CreditCard, Check } from 'lucide-react';

interface BookingPaymentProps {
    paymentMethod: 'cash' | 'online' | '';
    onSelectPayment: (method: 'cash' | 'online') => void;
}

const BookingPayment = ({ paymentMethod, onSelectPayment }: BookingPaymentProps) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Method</h2>
                <p className="text-gray-600 text-sm">Choose how you'd like to pay for your appointment</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button
                    type="button"
                    onClick={() => onSelectPayment('cash')}
                    aria-label="Select Pay at Venue"
                    className={`flex items-start justify-between p-4 rounded-lg border-2 text-left cursor-pointer ${paymentMethod === 'cash'
                        ? 'border-black bg-zinc-50'
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                            <Banknote className="w-6 h-6" />
                        </div>
                        <div className="pt-0.5">
                            <h3 className="font-bold text-gray-900 text-base">Pay at Venue</h3>
                            <p className="text-sm text-gray-600 mt-1 max-w-[200px]">No advance payment required. Pay by Cash or Card after your service.</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-black bg-black' : 'border-gray-200 bg-white'}`}>
                        {paymentMethod === 'cash' && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectPayment('online')}
                    aria-label="Select Online Payment"
                    className={`flex items-start justify-between p-4 rounded-lg border-2 text-left cursor-pointer ${paymentMethod === 'online'
                        ? 'border-black bg-zinc-50'
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${paymentMethod === 'online' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="pt-0.5">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 text-base">Online Payment</h3>
                                <span className="px-1.5 py-0.5 bg-zinc-900 text-[10px] font-black italic tracking-tighter text-white rounded">SECURE</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 max-w-[200px]">Securely pay via UPI, Credit/Debit Cards, or Net Banking.</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-black bg-black' : 'border-gray-200 bg-white'}`}>
                        {paymentMethod === 'online' && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default BookingPayment;
