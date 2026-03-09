import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

interface BookingOTPProps {
    phone: string;
    onVerify: (otp: string) => Promise<void> | void;
    onResend: () => void;
    isLoading: boolean;
    error?: string | null;
}

const BookingOTP = ({ phone, onVerify, onResend, isLoading, error = null }: BookingOTPProps) => {
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            const prevInput = (e.target as HTMLInputElement).previousSibling as HTMLInputElement;
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onVerify(otp.join(''));
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Verify Your Phone</h2>
                <p className="text-gray-500 text-sm">
                    Enter the 4-digit code sent to <span className="font-bold text-gray-900">{phone}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center gap-4 sm:gap-6">
                    {otp.map((data, index) => (
                        <input
                            className="w-14 h-16 border-2 border-gray-100 rounded-xl text-center text-2xl font-black text-zinc-900 focus:border-black focus:bg-zinc-50 outline-none transition-all duration-200"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={1}
                            key={index}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100/50 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-xs text-red-600 font-bold uppercase tracking-tight">{error}</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={!isComplete || isLoading}
                        className={`w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${isComplete && !isLoading
                            ? 'bg-black text-white hover:bg-zinc-900 shadow-lg shadow-black/20'
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <span>Verify & Confirm</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onResend}
                        disabled={isLoading}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors text-center"
                    >
                        Didn't receive code? <span className="text-black decoration-2 underline-offset-4 hover:underline cursor-pointer">Resend OTP</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingOTP;

