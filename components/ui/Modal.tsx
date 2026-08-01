"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    position?: 'center' | 'bottom';
}

const Modal = ({
    isOpen,
    onClose,
    children,
    className = "",
    showCloseButton = true,
    position = 'center'
}: ModalProps) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const isBottom = position === 'bottom';

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className={`fixed inset-0 z-[100] flex justify-center ${
                        isBottom
                            ? 'items-end sm:items-center p-0 sm:p-6'
                            : 'items-center p-4 sm:p-6'
                    }`}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xs"
                    />

                    {/* Content Container */}
                    <motion.div
                        initial={isBottom ? { y: "100%", opacity: 0 } : { scale: 0.95, opacity: 0 }}
                        animate={isBottom ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
                        exit={isBottom ? { y: "100%", opacity: 0 } : { scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col ${className}`}
                    >
                        {/* Close Button (Desktop Only if showCloseButton is true) */}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="hidden sm:block absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        )}

                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
