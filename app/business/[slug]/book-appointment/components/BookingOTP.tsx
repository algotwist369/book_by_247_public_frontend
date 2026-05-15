import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowRight, MessageSquare, Mail } from 'lucide-react';

interface BookingOTPProps {
    otpChannel: 'email' | 'sms';
    phone?: string;
    email?: string;
    onVerify: (otp: string) => Promise<void> | void;
    onResend: () => void;
    isLoading: boolean;
    error?: string | null;
}

const BookingOTP = ({ otpChannel, phone, email, onVerify, onResend, isLoading, error = null }: BookingOTPProps) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.every(digit => digit !== '')) {
            onVerify(otp.join(''));
        }
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        {otpChannel === 'email' ? (
                            <Mail className="w-6 h-6 text-zinc-900" />
                        ) : (
                            <MessageSquare className="w-6 h-6 text-zinc-900" />
                        )}
                    </div>
                    <h2 className="text-lg font-black text-zinc-900 tracking-tight">
                        {otpChannel === 'email' ? 'Verify Your Email' : 'Verify Your Phone'}
                    </h2>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                        We've sent a 4-digit verification code to <br />
                        <span className="font-bold text-zinc-900">
                            {otpChannel === 'email' && email ? email : `+91 ${phone}`}
                        </span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-3 sm:gap-4">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-md text-center text-lg font-black transition-all outline-none ${
                                    data 
                                        ? 'border-zinc-900 bg-white text-zinc-900' 
                                        : 'border-zinc-100 bg-zinc-50 text-zinc-400 focus:border-zinc-300'
                                }`}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={data}
                                onChange={e => handleChange(e.target.value, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[11px] font-bold text-center uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={!isComplete || isLoading}
                            className={`w-full h-12 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                isComplete && !isLoading
                                    ? 'bg-zinc-900 text-white hover:bg-black'
                                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Verify & Confirm</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onResend}
                                disabled={isLoading}
                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                Resend Code
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <p className="text-center text-[10px] text-zinc-400 mt-6 uppercase tracking-[0.2em] font-medium">
                Secure Verification by Bookby247
            </p>
        </div>
    );
};

export default BookingOTP;