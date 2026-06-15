"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { FiMail, FiMessageSquare, FiPhone, FiUser } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
        otpChannel: 'email'
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
        setFormData({ name: '', phone: '', email: '', message: '', otpChannel: 'email' });
        setSubmitError('');
        onClose();
    };

    const isDetailsValid = formData.name && formData.phone;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg px-4 sm:px-0">
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                {step === 'details' && (
                    <div className="p-5 sm:p-7 space-y-6">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Customer Enquiry</p>
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Send enquiry to - <span className="underline font-semibold">{businessName}</span></h2>
                            <p className="text-sm text-zinc-600">
                                Fill your details and the business team will contact you shortly.
                            </p>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wide">Full Name</label>
                                <Input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    icon={<FiUser className="w-4 h-4 text-zinc-400" />}
                                    className="h-11 border-zinc-300 text-sm text-black focus-visible:ring-0 focus-visible:outline-none focus:border-zinc-300"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wide">Phone Number</label>
                                <Input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your mobile number"
                                    icon={<FiPhone className="w-4 h-4 text-zinc-400" />}
                                    className="h-11 border-zinc-300 text-sm text-black focus-visible:ring-0 focus-visible:outline-none focus:border-zinc-300"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wide">Email (Optional)</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    icon={<FiMail className="w-4 h-4 text-zinc-400" />}
                                    className="h-11 border-zinc-300 text-sm text-black focus-visible:ring-0 focus-visible:outline-none focus:border-zinc-300"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wide">Send OTP via</label>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="inquiryOtpChannel"
                                            value="email"
                                            checked={formData.otpChannel === 'email'}
                                            onChange={() => handleOtpChannelChange('email')}
                                            className="w-4 h-4 text-zinc-900 bg-gray-100 border-gray-300 focus:ring-zinc-900"
                                        />
                                        <span className="text-sm text-gray-700 flex items-center gap-1">
                                            <FiMail className="w-3.5 h-3.5" />
                                            Email
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="inquiryOtpChannel"
                                            value="sms"
                                            checked={formData.otpChannel === 'sms'}
                                            onChange={() => handleOtpChannelChange('sms')}
                                            className="w-4 h-4 text-zinc-900 bg-gray-100 border-gray-300 focus:ring-zinc-900"
                                        />
                                        <span className="text-sm text-gray-700 flex items-center gap-1">
                                            <FiPhone className="w-3.5 h-3.5" />
                                            SMS
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wide">Message</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-zinc-400">
                                        <FiMessageSquare className="w-4 h-4" />
                                    </div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Describe your requirement..."
                                        className="w-full h-28 sm:h-32 pl-10 pr-3 py-2.5 rounded-md border border-zinc-300 bg-white focus:border-zinc-300 focus:outline-none text-sm text-black placeholder:text-zinc-400 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-1">
                                <Button
                                    type="submit"
                                    disabled={!isDetailsValid || isSubmitting}
                                    className="w-full h-11 text-sm font-semibold rounded-md"
                                >
                                    {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP & Continue'}
                                </Button>
                                {submitError && (
                                    <p className="text-[12px] text-red-600 mt-2">{submitError}</p>
                                )}
                                <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
                                    By clicking Send OTP, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="p-5 sm:p-7">
                        <button
                            onClick={handleBackToDetails}
                            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
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
                            <div className="w-14 h-14 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-900">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-zinc-900">Enquiry Sent</h3>
                            <p className="text-sm text-zinc-600">
                                Thank you for your interest. {businessName} will contact you shortly.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EnquiryModal;
