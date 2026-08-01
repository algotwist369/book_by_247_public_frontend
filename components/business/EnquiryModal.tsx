"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { FiMail, FiPhone, FiUser } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import { inquiryApi, SendInquiryOtpPayload } from '@/api/public/inquiry';
import BookingOTP from '@/app/business/[slug]/book-appointment/components/BookingOTP';

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
    businessId?: string;
}

type EnquiryStep = 'details' | 'otp' | 'success';
type VerifyInquiryOtpPayload = Parameters<typeof inquiryApi.verifyInquiryOTP>[0];

const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const EnquiryModal = ({ isOpen, onClose, businessName, businessId }: EnquiryModalProps) => {
    const [step, setStep] = useState<EnquiryStep>('details');
    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
        email: string;
        message: string;
        otpChannel: 'email' | 'sms';
    }>({
        name: '',
        phone: '',
        email: '',
        message: '',
        otpChannel: 'sms'
    });
    const [submitError, setSubmitError] = useState('');

    const sendOtpMutation = useMutation({
        mutationFn: (payload: SendInquiryOtpPayload) => inquiryApi.sendInquiryOTP(payload),
        onSuccess: (response) => {
            if (response.success) {
                setStep('otp');
            } else {
                setSubmitError(response.message || 'Failed to send OTP');
            }
        },
        onError: (error: unknown) => {
            setSubmitError(getErrorMessage(error, 'Failed to send OTP'));
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: (otp: string) => {
            const verifyData: VerifyInquiryOtpPayload = { otp };
            if (formData.otpChannel === 'email' && formData.email) {
                verifyData.email = formData.email;
            } else {
                verifyData.phone = formData.phone;
            }
            return inquiryApi.verifyInquiryOTP(verifyData);
        },
        onSuccess: async (response, otp) => {
            if (response.success) {
                await createInquiryMutation.mutateAsync(otp);
            } else {
                setSubmitError(response.message || 'Invalid OTP');
            }
        },
        onError: (error: unknown) => {
            setSubmitError(getErrorMessage(error, 'OTP verification failed'));
        }
    });

    const createInquiryMutation = useMutation({
        mutationFn: (otp: string) => {
            if (!businessId) {
                throw new Error('Business details are still loading. Please try again.');
            }

            return inquiryApi.createInquiry({
                business_id: businessId,
                user_name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim() || undefined,
                inquiry_type: formData.message.trim() || 'General',
                otp
            });
        },
        onSuccess: (response) => {
            if (response.success) {
                setStep('success');
            } else {
                setSubmitError(response.message || 'Failed to send enquiry');
            }
        },
        onError: (error: unknown) => {
            setSubmitError(getErrorMessage(error, 'Failed to send enquiry'));
        }
    });

    const isSubmitting = sendOtpMutation.isPending || verifyOtpMutation.isPending || createInquiryMutation.isPending;

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        
        if (!businessId) {
            setSubmitError('Business details are still loading. Please try again.');
            return;
        }

        await sendOtpMutation.mutateAsync({
            phone: formData.phone.trim(),
            email: formData.email.trim() || undefined,
            otpChannel: formData.otpChannel
        });
    };

    const handleBackToDetails = () => {
        setStep('details');
        setSubmitError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOtpChannelChange = (channel: 'email' | 'sms') => {
        setFormData(prev => ({ ...prev, otpChannel: channel }));
    };

    const handleClose = () => {
        setStep('details');
        setFormData({ name: '', phone: '', email: '', message: '', otpChannel: 'sms' });
        setSubmitError('');
        onClose();
    };

    const isDetailsValid = Boolean(formData.name && formData.phone);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} position="bottom" className="max-w-md w-full p-0 overflow-hidden bg-transparent border-0 shadow-none">
            <div className="bg-white rounded-t-[32px] sm:rounded-3xl border border-zinc-200/80 shadow-2xl overflow-hidden relative transition-all">
                {/* Top Drag Handle Indicator for Mobile */}
                <div className="pt-3 pb-1 flex justify-center">
                    <div className="w-12 h-1 bg-zinc-200 rounded-full" />
                </div>

                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer z-10"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 'details' && (
                    <div className="px-5 pb-6 pt-1 sm:px-7 sm:pb-8 space-y-5">
                        {/* Gold Badge & Header matching Target Screenshot */}
                        <div className="text-center space-y-2">
                            <div className="inline-block">
                                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-amber-900 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                                    ✨ QUICK ENQUIRY
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-tight px-4">
                                Send enquiry to <span className="text-black font-black">{businessName}</span>
                            </h2>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-3.5">
                            {/* Full Name Input Box */}
                            <div className="bg-zinc-100/90 border border-transparent focus-within:border-zinc-900 focus-within:bg-white rounded-2xl p-3 flex items-center gap-3 transition-all">
                                <FiUser className="w-5 h-5 text-zinc-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <label className="text-[10px] font-medium text-zinc-400 block leading-none mb-0.5">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Phone Number Input Box */}
                            <div className="bg-zinc-100/90 border border-transparent focus-within:border-zinc-900 focus-within:bg-white rounded-2xl p-3 flex items-center gap-3 transition-all">
                                <FiPhone className="w-5 h-5 text-zinc-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <label className="text-[10px] font-medium text-zinc-400 block leading-none mb-0.5">
                                        Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your mobile number"
                                        className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Email (Optional) Input Box */}
                            <div className="bg-zinc-100/90 border border-transparent focus-within:border-zinc-900 focus-within:bg-white rounded-2xl p-3 flex items-center gap-3 transition-all">
                                <FiMail className="w-5 h-5 text-zinc-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <label className="text-[10px] font-medium text-zinc-400 block leading-none mb-0.5">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* OTP Channel Selection Row matching Target Screenshot */}
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs sm:text-sm font-bold text-zinc-800">
                                    Send OTP via:
                                </span>
                                <div className="bg-zinc-100 p-1 rounded-2xl flex items-center gap-1 border border-zinc-200/50">
                                    <button
                                        type="button"
                                        onClick={() => handleOtpChannelChange('sms')}
                                        className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            formData.otpChannel === 'sms'
                                                ? 'bg-[#182238] text-white shadow-xs'
                                                : 'text-zinc-500 hover:text-zinc-800'
                                        }`}
                                    >
                                        SMS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOtpChannelChange('email')}
                                        className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            formData.otpChannel === 'email'
                                                ? 'bg-[#182238] text-white shadow-xs'
                                                : 'text-zinc-500 hover:text-zinc-800'
                                        }`}
                                    >
                                        Email
                                    </button>
                                </div>
                            </div>

                            {/* Message Text Area matching Target Screenshot */}
                            <div className="border border-zinc-200 bg-white rounded-2xl p-3 focus-within:border-zinc-900 transition-all">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Share your requirements or preferred time 📝"
                                    className="w-full h-20 bg-transparent border-0 p-0 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!isDetailsValid || isSubmitting}
                                    className={`w-full h-13 text-sm font-extrabold rounded-2xl shadow-lg flex items-center justify-center transition-all cursor-pointer ${
                                        !isDetailsValid || isSubmitting
                                            ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                                            : 'bg-black hover:bg-zinc-900 active:scale-[0.98] text-white'
                                    }`}
                                >
                                    {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP & Continue'}
                                </button>

                                {submitError && (
                                    <p className="text-xs text-red-600 text-center mt-2 font-medium">{submitError}</p>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="p-5 sm:p-7">
                        <button
                            onClick={handleBackToDetails}
                            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6 font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to details
                        </button>
                        <BookingOTP
                            otpChannel={formData.otpChannel}
                            phone={formData.phone}
                            email={formData.email}
                            onVerify={(otp) => verifyOtpMutation.mutate(otp)}
                            onResend={() => sendOtpMutation.mutate({
                                phone: formData.phone.trim(),
                                email: formData.email.trim() || undefined,
                                otpChannel: formData.otpChannel
                            })}
                            isLoading={verifyOtpMutation.isPending || sendOtpMutation.isPending}
                            error={submitError}
                        />
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-8 sm:p-10 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-zinc-900">Enquiry Sent Successfully</h3>
                            <p className="text-sm text-zinc-600">
                                Thank you for reaching out! <span className="font-semibold text-zinc-900">{businessName}</span> will contact you shortly.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full h-11 bg-black text-white font-bold text-xs rounded-xl mt-4"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EnquiryModal;
