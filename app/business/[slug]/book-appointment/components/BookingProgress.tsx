import React from 'react';

interface BookingProgressProps {
    step: 'services' | 'schedule' | 'details' | 'payment' | 'otp' | 'success';
}

const BookingProgress = ({ step }: BookingProgressProps) => {
    if (step === 'success') return null;

    const steps = [
        { id: 'services', label: 'Services' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'details', label: 'Details' },
        { id: 'payment', label: 'Payment' }
    ];

    const displayStep = step === 'otp' ? 'payment' : step;
    const currentIndex = steps.findIndex(s => s.id === displayStep);

    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => {
                const isCompleted = i < currentIndex;
                const isCurrent = i === currentIndex;

                return (
                    <React.Fragment key={s.id}>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : isCurrent
                                        ? 'bg-zinc-900 text-white'
                                        : 'bg-zinc-100 text-zinc-400'
                            }`}>
                                {isCompleted ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            <span className={`text-xs font-bold tracking-tight hidden sm:block ${
                                isCurrent ? 'text-zinc-900' : isCompleted ? 'text-emerald-600' : 'text-zinc-400'
                            }`}>
                                {s.label}
                            </span>
                        </div>

                        {i < steps.length - 1 && (
                            <div className={`w-8 sm:w-12 h-[2px] rounded-full transition-all ${
                                isCompleted ? 'bg-emerald-500' : 'bg-zinc-200'
                            }`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default BookingProgress;