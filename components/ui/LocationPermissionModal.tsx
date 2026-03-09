"use client";

import React from 'react';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import { Button } from './Button';

interface LocationPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAllow: () => void;
    isLocating?: boolean;
}

const LocationPermissionModal = ({ 
    isOpen, 
    onClose, 
    onAllow, 
    isLocating = false 
}: LocationPermissionModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md px-4 sm:px-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 sm:p-10 text-center space-y-6">
                    {/* Icon Header */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-[#008080]">
                                <MapPin className="w-10 h-10" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100">
                                <Navigation className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Show Nearby Businesses?</h2>
                        <p className="text-zinc-500 font-medium text-sm leading-relaxed px-2">
                            We use your location to find the best spas, salons, and beauty experts right in your neighborhood.
                        </p>
                    </div>

                    {/* Features/Points */}
                    <div className="flex flex-col gap-3 py-2">
                        <div className="flex items-center gap-3 text-left px-4">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-700">Privacy first: We don't store your exact path</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 space-y-3">
                        <Button
                            onClick={onAllow}
                            disabled={isLocating}
                            className="w-full h-14 bg-[#008080] hover:bg-[#006666] text-white font-black text-lg rounded-2xl shadow-lg shadow-[#008080]/20 gap-2"
                        >
                            {isLocating ? 'Locating...' : 'Allow Location Access'}
                            {!isLocating && <Navigation className="w-5 h-5" />}
                        </Button>
                        <button
                            onClick={onClose}
                            className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LocationPermissionModal;
