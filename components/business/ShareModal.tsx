"use client";

import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail, Send, MessageCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const ShareModal = ({ isOpen, onClose, url }: ShareModalProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'text-green-500',
            href: `https://wa.me/?text=${encodeURIComponent(url)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'text-blue-600',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'text-sky-400',
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'text-blue-700',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        },
        {
            name: 'Telegram',
            icon: Send,
            color: 'text-blue-500',
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}`
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'text-gray-600',
            href: `mailto:?body=${encodeURIComponent(url)}`
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            className="max-w-md w-full"
        >
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                    <h3 className="text-lg font-bold text-zinc-900">Share</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Copy Link Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-600">Page Link</label>
                        <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 truncate">
                                {url}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied
                                    ? 'bg-green-600 text-white'
                                    : 'bg-black text-white hover:bg-zinc-800'
                                    }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Social Icons Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                            >
                                <link.icon className={`w-8 h-8 ${link.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-xs font-medium text-zinc-600">{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;
