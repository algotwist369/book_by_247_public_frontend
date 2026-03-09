"use client";

import React, { useState } from 'react';
import { User, Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
}

const EnquiryModal = ({ isOpen, onClose, businessName }: EnquiryModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Enquiry Submitted:', formData);
        setIsSubmitting(false);
        setIsSuccess(true);

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
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                {!isSuccess ? (
                    <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Send Enquiry</h2>
                            <p className="text-sm text-zinc-500 font-medium">
                                Get in touch with <span className="text-zinc-900 font-bold">{businessName}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            {/* Name Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider ml-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your mobile number"
                                        className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider ml-1">Email (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider ml-1">Message</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Describe your requirement..."
                                        className="w-full h-28 sm:h-32 pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all text-zinc-900 placeholder:text-zinc-400 font-medium resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full h-14 font-black text-base sm:text-lg transition-all rounded-xl gap-2 shadow-lg ${isSubmitting ? 'bg-zinc-400' : 'bg-black hover:bg-zinc-800 shadow-black/20'
                                        }`}
                                >
                                    {isSubmitting ? 'Sending Request...' : 'Send Enquiry'}
                                    {!isSubmitting && <Send className="w-5 h-5" />}
                                </Button>
                                <p className="text-[10px] text-center text-zinc-400 mt-4 leading-relaxed px-4">
                                    By clicking Send Enquiry, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                                </p>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="p-10 sm:p-16 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-bounce">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-zinc-900">Enquiry Sent!</h3>
                            <p className="text-zinc-500 font-medium">
                                Thank you for your interest. <span className="text-zinc-900 font-bold">{businessName}</span> will contact you shortly.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EnquiryModal;
