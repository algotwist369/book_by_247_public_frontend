import React from 'react';
import { User, Phone, Mail, Smartphone } from 'lucide-react';

interface BookingDetailsProps {
    formData: { name: string; phone: string; email: string; notes: string; otpChannel: 'email' | 'sms' };
    onUpdateForm: (data: Partial<{ name: string; phone: string; email: string; notes: string; otpChannel: 'email' | 'sms' }>) => void;
}

const BookingDetails = ({ formData, onUpdateForm }: BookingDetailsProps) => {
    const digitsOnly = formData.phone.replace(/\D/g, '');

    const getPhoneError = (): string => {
        if (digitsOnly.length === 0) return '';
        if (digitsOnly.length < 10) return `Enter ${10 - digitsOnly.length} more digit${10 - digitsOnly.length > 1 ? 's' : ''}`;
        if (!/^[6-9]/.test(digitsOnly)) return 'Must start with 6, 7, 8, or 9';
        if (/^(\d)\1{9}$/.test(digitsOnly)) return 'Invalid number - all digits are the same';
        if (/^(0123456789|1234567890|9876543210)$/.test(digitsOnly)) return 'Invalid number - sequential digits';
        return '';
    };

    const phoneError = getPhoneError();
    const isPhoneValid = digitsOnly.length === 10 && !phoneError;
    const showPhoneError = digitsOnly.length > 0 && !!phoneError;

    const handlePhoneChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 10);
        onUpdateForm({ phone: cleaned });
    };

    const handleOtpChannelChange = (channel: 'email' | 'sms') => {
        onUpdateForm({ otpChannel: channel });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Details</h2>
            <p className="text-gray-600 text-sm mb-6">We need your info to confirm the booking</p>

            <div className="space-y-4">
                <div>
                    <label htmlFor="booking-name" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            id="booking-name"
                            type="text"
                            aria-label="Full Name"
                            placeholder="John Doe"
                            className="w-full h-11 pl-10 pr-3 bg-white border border-gray-200 rounded-lg focus:border-black outline-none text-sm text-black placeholder:text-gray-500"
                            value={formData.name}
                            onChange={(e) => onUpdateForm({ name: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="booking-phone" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Phone Number</label>
                    <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${showPhoneError ? 'text-red-500' : 'text-gray-500'}`} />
                        <input
                            id="booking-phone"
                            type="tel"
                            aria-label="Phone Number"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            className={`w-full h-11 pl-10 pr-3 bg-white border rounded-lg outline-none text-sm text-black placeholder:text-gray-500 ${showPhoneError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-black'}`}
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                        />
                    </div>
                    {showPhoneError && (
                        <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                    )}
                    {isPhoneValid && (
                        <p className="text-xs text-black mt-1">✓ Valid phone number</p>
                    )}
                </div>

                <div>
                    <label htmlFor="booking-email" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Email Address <span className="text-gray-600 normal-case tracking-normal">(optional)</span></label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            id="booking-email"
                            type="email"
                            aria-label="Email Address"
                            placeholder="you@example.com"
                            className="w-full h-11 pl-10 pr-3 bg-white border border-gray-200 rounded-lg focus:border-black outline-none text-sm text-black placeholder:text-gray-500"
                            value={formData.email}
                            onChange={(e) => onUpdateForm({ email: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Send OTP via</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="otpChannel"
                                value="email"
                                aria-label="Send OTP via Email"
                                checked={formData.otpChannel === 'email'}
                                onChange={() => handleOtpChannelChange('email')}
                                className="w-4 h-4 text-zinc-900 bg-gray-100 border-gray-300 focus:ring-zinc-900"
                            />
                            <span className="text-sm text-gray-800 flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                Email
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="otpChannel"
                                value="sms"
                                aria-label="Send OTP via SMS"
                                checked={formData.otpChannel === 'sms'}
                                onChange={() => handleOtpChannelChange('sms')}
                                className="w-4 h-4 text-zinc-900 bg-gray-100 border-gray-300 focus:ring-zinc-900"
                            />
                            <span className="text-sm text-gray-800 flex items-center gap-1">
                                <Smartphone className="w-3.5 h-3.5" />
                                SMS
                            </span>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="booking-notes" className="text-xs font-semibold text-black uppercase tracking-wider mb-1.5 block">Special Instructions <span className="text-gray-600 normal-case tracking-normal">(optional)</span></label>
                    <textarea
                        id="booking-notes"
                        aria-label="Special Instructions"
                        placeholder="Any special requirements..."
                        className="w-full h-28 p-3 bg-white border border-gray-200 rounded-lg focus:border-black outline-none text-sm text-black placeholder:text-gray-500 resize-none"
                        value={formData.notes}
                        onChange={(e) => onUpdateForm({ notes: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
