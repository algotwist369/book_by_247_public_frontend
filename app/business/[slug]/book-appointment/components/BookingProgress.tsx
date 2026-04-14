import React from 'react';
import { Check, ClipboardList, Calendar, User, CreditCard } from 'lucide-react';

interface BookingProgressProps {
    step: 'services' | 'schedule' | 'details' | 'payment' | 'success';
}

const BookingProgress = ({ step }: BookingProgressProps) => {
    if (step === 'success') return null;

    const steps = [
        { id: 'services', label: 'Services', icon: ClipboardList },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'details', label: 'Details', icon: User },
        { id: 'payment', label: 'Payment', icon: CreditCard }
    ];

    return (
        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto px-4">
            {steps.map((s, i) => {
                const Icon = s.icon;
                const isCurrent = step === s.id;
                const isCompleted =
                    (step === 'schedule' && i < 1) ||
                    (step === 'details' && i < 2) ||
                    (step === 'payment' && i < 3);

                return (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            {/* Icon Circle */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCurrent
                                ? 'bg-zinc-900 text-white'
                                : isCompleted
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
                                }`}>
                                {isCompleted ? (
                                    <Check className="w-6 h-6 stroke-3" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>

                            {/* Label */}
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-zinc-900' : 'text-zinc-400'
                                }`}>
                                {s.label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {i < 3 && (
                            <div className="flex-1 px-2 mb-6">
                                <div className="h-[2px] w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${isCompleted ? 'w-full bg-zinc-900' : 'w-0'}`}
                                    />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default BookingProgress;
