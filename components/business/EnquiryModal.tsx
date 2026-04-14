"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { FiMail, FiMessageSquare, FiPhone, FiUser } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { inquiryApi } from '@/api/public/inquiry';

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
    businessId?: string;
    businessSlug?: string;
}

const EnquiryModal = ({ isOpen, onClose, businessName, businessId, businessSlug }: EnquiryModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const inquiryMutation = useMutation({
        mutationFn: (payload: {
            business_id?: string;
            business_slug?: string;
            user_name: string;
            phone: string;
            inquiry_type: string;
        }) =>
            inquiryApi.createInquiry(payload)
    });

    const isSubmitting = inquiryMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        console.log('[EnquiryModal] submit payload preview', {
            businessId,
            businessSlug,
            businessName,
            formData
        });

        let sentSuccessfully = false;
        try {
            if (!businessId && !businessSlug) {
                throw new Error('Missing business id/slug at submit time');
            }

            await inquiryMutation.mutateAsync({
                business_id: businessId,
                business_slug: businessSlug,
                user_name: formData.name,
                phone: formData.phone,
                inquiry_type: formData.message || 'General'
            });
            setIsSuccess(true);
            sentSuccessfully = true;
        } catch (error: any) {
            console.error('[EnquiryModal] submit failed', {
                error,
                businessId,
                businessSlug,
                formData
            });
            setSubmitError(error?.message || 'Failed to send enquiry. Please try again.');
        }

        if (!sentSuccessfully) return;

        // Close modal after showing success message
        setTimeout(() => {
            onClose();
            // Reset state
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ name: '', phone: '', email: '', message: '' });
            }, 300);
        }, 2500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg px-4 sm:px-0">
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                {!isSuccess ? (
                    <div className="p-5 sm:p-7 space-y-6">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Customer Enquiry</p>
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Send enquiry to - <span className="underline font-semibold">{businessName}</span></h2>
                            <p className="text-sm text-zinc-600">
                                Fill your details and the business team will contact you shortly.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    disabled={isSubmitting}
                                    className="w-full h-11 text-sm font-semibold rounded-md"
                                >
                                    {isSubmitting ? 'Sending enquiry...' : 'Send Enquiry'}
                                </Button>
                                {submitError && (
                                    <p className="text-[12px] text-red-600 mt-2">{submitError}</p>
                                )}
                                <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
                                    By clicking Send Enquiry, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                                </p>
                            </div>
                        </form>
                    </div>
                ) : (
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
