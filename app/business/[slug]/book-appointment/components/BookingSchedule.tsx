import React, { useEffect, useRef, useState } from 'react';
import { appointmentApi } from '@/api/public/appointment';
import { ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';

interface BookingScheduleProps {
    businessSlug: string;
    selectedDate: string;
    onSelectDate: (date: string) => void;
    selectedTime: string;
    onSelectTime: (time: string) => void;
}

const to12Hour = (time: string): string => {
    try {
        if (/am|pm/i.test(time)) return time;
        const [h, m] = time.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
    } catch {
        return time;
    }
};

const BookingSchedule = ({
    businessSlug,
    selectedDate,
    onSelectDate,
    selectedTime,
    onSelectTime
}: BookingScheduleProps) => {
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [is24Hour, setIs24Hour] = useState(false);
    const dateContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) return;
            setIsLoading(true);
            setError('');
            setAvailableSlots([]);

            try {
                const response = await appointmentApi.getAvailableSlots(businessSlug, selectedDate);
                if (response.success && response.data?.slots) {
                    const slots = response.data.availableSlots || response.data.slots.map((s: any) => s.startTime);
                    setAvailableSlots(slots);
                } else {
                    setAvailableSlots([]);
                }
            } catch (err) {
                console.error("Failed to fetch slots", err);
                setError('Failed to load slots. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlots();
    }, [businessSlug, selectedDate]);

    const dates = [...Array(14)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: date.getDate(),
            monthName: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: date.toISOString().split('T')[0]
        };
    });

    const formatTime = (time: string) => is24Hour ? time : to12Hour(time);

    const scrollDates = (direction: 'left' | 'right') => {
        if (!dateContainerRef.current) return;
        dateContainerRef.current.scrollBy({
            left: direction === 'left' ? -200 : 200,
            behavior: 'smooth'
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Pick Date & Time</h2>
            <p className="text-gray-500 text-sm mb-6">Select your preferred appointment slot</p>

            {/* Date Section */}
            <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Date</label>

                <div className="relative flex items-center gap-1">
                    <button
                        onClick={() => scrollDates('left')}
                        className="shrink-0 w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300"
                        aria-label="Previous dates"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div
                        ref={dateContainerRef}
                        className="flex gap-2 overflow-x-auto no-scrollbar"
                    >
                        {dates.map((dateItem, i) => {
                            const isActive = selectedDate === dateItem.fullDate;
                            return (
                                <button
                                    key={i}
                                    onClick={() => onSelectDate(dateItem.fullDate)}
                                    className={`shrink-0 w-14 py-2.5 rounded-lg flex flex-col items-center justify-center text-center border ${isActive
                                        ? 'border-zinc-900 bg-zinc-900 text-white'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <span className={`text-[10px] font-medium uppercase ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{dateItem.dayName}</span>
                                    <span className="text-base font-semibold leading-tight mt-0.5">{dateItem.dateNum}</span>
                                    <span className={`text-[9px] font-medium ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{dateItem.monthName}</span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => scrollDates('right')}
                        className="shrink-0 w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300"
                        aria-label="Next dates"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Slots Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Slots</label>
                    <button
                        onClick={() => setIs24Hour(prev => !prev)}
                        className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 text-[11px] font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                        <Clock className="w-3 h-3" />
                        {is24Hour ? '24H' : '12H'}
                    </button>
                </div>

                {!selectedDate ? (
                    <p className="text-sm text-gray-400 py-4">Select a date to see available slots.</p>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 text-zinc-900 animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">No slots available for this date.</p>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => onSelectTime(time)}
                                className={`py-2.5 rounded-lg text-sm font-medium border ${selectedTime === time
                                    ? 'border-zinc-900 bg-zinc-900 text-white'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                {formatTime(time)}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingSchedule;

