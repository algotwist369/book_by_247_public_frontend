"use client";

import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Business } from '@/components/business/businessData';
import { appointmentApi, BookingData } from '@/api/public/appointment';

// Modular Components
import BookingHeader from './components/BookingHeader';
import BookingProgress from './components/BookingProgress';
import BookingServices from './components/BookingServices';
import BookingSchedule from './components/BookingSchedule';
import BookingDetails from './components/BookingDetails';
import BookingPayment from './components/BookingPayment';
import BookingSummary from './components/BookingSummary';
import BookingSuccess from './components/BookingSuccess';
import BookingOTP from './components/BookingOTP';

interface BookingPageContentProps {
    business: Business;
}

type BookingStep = 'services' | 'schedule' | 'details' | 'payment' | 'otp' | 'success';

const STORAGE_KEY = 'appointment_booking_data';

interface ConfirmedAppointment {
    appointmentDate?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    totalAmount?: number;
    customer?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    business?: {
        name?: string;
        branch?: string;
        address?: string;
        phone?: string;
    };
    services?: Array<{
        _id?: string;
        name?: string;
        price?: number;
        duration?: number;
    }>;
}

const BookingPageContent = ({ business }: BookingPageContentProps) => {
    const [step, setStep] = useState<BookingStep>('services');
    const [selectedServices, setSelectedServices] = useState<{ serviceId: string | number; optionIdx: number; addOnIds: string[] }[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [formData, setFormData] = useState({ name: '', phone: '', notes: '' });
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | ''>('');
    const [confirmationCode, setConfirmationCode] = useState<string>('');
    const [confirmedAppointment, setConfirmedAppointment] = useState<ConfirmedAppointment | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);

    // Mutations
    const bookingMutation = useMutation({
        mutationFn: (data: BookingData) => appointmentApi.bookAppointment(business.slug, data),
        onSuccess: (response) => {
            if (response.success) {
                if (response.requiresOTP) {
                    setStep('otp');
                } else {
                    const code = response.data?.confirmationCode || response.data?.appointment?.bookingNumber || 'CONFIRMED';
                    setConfirmationCode(code);
                    setConfirmedAppointment(response.data?.appointment || null);
                    setStep('success');
                }
            }
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: (otp: string) => appointmentApi.verifyOTP(business.slug, formData.phone, otp),
        onSuccess: (response) => {
            if (response.success) {
                const code = response.data?.confirmationCode || response.data?.appointment?.bookingNumber || 'CONFIRMED';
                setConfirmationCode(code);
                setConfirmedAppointment(response.data?.appointment || null);
                setStep('success');
            } else {
                setOtpError(response.message || "Invalid OTP");
            }
        },
        onError: (error: any) => {
            setOtpError(error.message || "Verification failed");
        }
    });

    const isSubmitting = bookingMutation.isPending || verifyOtpMutation.isPending;
    const bookingError = bookingMutation.error?.message || (bookingMutation.data && !bookingMutation.data.success ? bookingMutation.data.message : null);

    // Persistence: Load data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.businessSlug === business.slug) {
                    const parsedServices = Array.isArray(parsed.selectedServices)
                        ? parsed.selectedServices.map((s: any) => ({
                            serviceId: s.serviceId,
                            optionIdx: s.optionIdx,
                            addOnIds: Array.isArray(s.addOnIds) ? s.addOnIds : []
                        }))
                        : [];
                    setSelectedServices(parsedServices);
                    setSelectedDate(parsed.selectedDate || '');
                    setSelectedTime(parsed.selectedTime || '');
                    setFormData(parsed.formData || { name: '', phone: '', notes: '' });
                    setPaymentMethod(parsed.paymentMethod || '');
                    if (parsed.step && parsed.step !== 'success') {
                        setStep(parsed.step);
                    }
                }
            } catch (e) {
                console.error("Failed to load booking data", e);
            }
        }
        setIsLoaded(true);
    }, [business.slug]);

    // Persistence: Save data to localStorage
    useEffect(() => {
        if (isLoaded && step !== 'success') {
            const dataToSave = {
                businessSlug: business.slug,
                selectedServices,
                selectedDate,
                selectedTime,
                formData,
                paymentMethod,
                step
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
    }, [isLoaded, step, selectedServices, selectedDate, selectedTime, formData, paymentMethod, business.slug]);

    // Clear persistence on success
    useEffect(() => {
        if (step === 'success') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [step]);

    const toggleService = (serviceId: string | number, optionIdx: number) => {
        setSelectedServices(prev => {
            const existingEntry = prev.find(s => s.serviceId === serviceId);
            if (existingEntry) {
                if (existingEntry.optionIdx === optionIdx) {
                    return prev.filter(s => s.serviceId !== serviceId);
                } else {
                    return prev.map(s =>
                        s.serviceId === serviceId
                            ? { ...s, optionIdx, addOnIds: [] }
                            : s
                    );
                }
            } else {
                return [...prev, { serviceId, optionIdx, addOnIds: [] }];
            }
        });
    };

    const toggleServiceAddOn = (serviceId: string | number, optionIdx: number, addOnId: string) => {
        setSelectedServices(prev => prev.map(selection => {
            if (selection.serviceId !== serviceId || selection.optionIdx !== optionIdx) return selection;
            const currentAddOns = Array.isArray(selection.addOnIds) ? selection.addOnIds : [];
            const hasAddOn = currentAddOns.includes(addOnId);
            return {
                ...selection,
                addOnIds: hasAddOn
                    ? currentAddOns.filter(id => id !== addOnId)
                    : [...currentAddOns, addOnId]
            };
        }));
    };

    const handleNext = () => {
        if (step === 'services') setStep('schedule');
        else if (step === 'schedule') setStep('details');
        else if (step === 'details') setStep('payment');
    };

    const handleBack = () => {
        if (step === 'schedule') setStep('services');
        else if (step === 'details') setStep('schedule');
        else if (step === 'payment') setStep('details');
    };

    const updateForm = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    // Helper to find service details including normalizing options
    const getServiceDetails = (serviceId: string | number, optionIdx: number) => {
        const service = business.services?.find(s => (s._id || s.id) === serviceId);
        if (!service) return null;

        const rawOptions = service.options || (service as any).pricingOptions || [];

        let options: any[] = [];
        if (rawOptions.length > 0) {
            options = rawOptions.map((opt: any) => ({
                duration: opt.duration ? `${opt.duration} Mins` : (opt.time ? `${opt.time} Mins` : "60 Mins"),
                price: opt.price || opt.amount || 0, // sellingPrice
                originalPrice: opt.originalPrice || 0 // previousPrice
            }));
        } else if (service.price !== undefined) {
            options = [{ 
                duration: `${service.duration || 60} Mins`, 
                price: service.price, // sellingPrice
                originalPrice: (service as any).originalPrice || 0 // previousPrice
            }];
        }

        const option = options[optionIdx];
        return {
            name: service.name,
            duration: option?.duration,
            price: option?.price || 0,
            originalPrice: option?.originalPrice || 0,
            originalService: service
        };
    };

    const selectedServiceDetails = selectedServices.map(s => {
        const details = getServiceDetails(s.serviceId, s.optionIdx);
        if (!details) return { name: 'Unknown', duration: '0', price: 0, originalPrice: 0 };
        const service = details.originalService as any;
        const addOns = ((service?.addOns || []) as any[]).filter(addon => (s.addOnIds || []).includes(String(addon?._id)));
        const addOnsPrice = addOns.reduce((sum, addon) => sum + Number(addon?.price || 0), 0);
        const addOnsDuration = addOns.reduce((sum, addon) => sum + Number(addon?.duration || 0), 0);
        return {
            ...details,
            price: Number(details.price || 0) + addOnsPrice,
            originalPrice: Number(details.originalPrice || 0) + addOnsPrice,
            duration: `${parseInt(details.duration || '0') + addOnsDuration}`,
            addOns
        };
    });

    const totalPrice = selectedServiceDetails.reduce((acc, s) => acc + (s.price || 0), 0);
    const durationTotal = selectedServiceDetails.reduce((acc, s) => acc + parseInt(s.duration || '0'), 0);

    // Construct Booking Data
    const getBookingData = (): BookingData => {
        const normalizeTo24HourTime = (rawTime: string): string => {
            const timeValue = rawTime.trim();

            // Already in HH:mm format
            if (/^\d{2}:\d{2}$/.test(timeValue)) {
                return timeValue;
            }

            // Accept common 12-hour formats like "9:30 PM" or "09:30 am"
            const match = timeValue.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
            if (match) {
                let hours = Number(match[1]);
                const minutes = Number(match[2]);
                const period = match[3].toUpperCase();

                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;

                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            }

            return timeValue;
        };

        const addMinutesToTime = (timeStr: string, minsToAdd: number): string => {
            const normalizedTime = normalizeTo24HourTime(timeStr);
            const [hoursPart = "0", minutesPart = "0"] = normalizedTime.split(":");
            const hours = Number(hoursPart);
            const minutes = Number(minutesPart);

            if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
                return normalizedTime;
            }

            const totalMinutes = ((hours * 60 + minutes + minsToAdd) % (24 * 60) + (24 * 60)) % (24 * 60);
            const nextHours = Math.floor(totalMinutes / 60);
            const nextMinutes = totalMinutes % 60;

            return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
        };

        const normalizedStartTime = normalizeTo24HourTime(selectedTime);

        return {
            customerInfo: {
                name: formData.name,
                phone: formData.phone,
            },
            appointmentDate: selectedDate,
            startTime: normalizedStartTime,
            endTime: addMinutesToTime(normalizedStartTime, durationTotal),
            services: selectedServices.map(s => {
                const details = getServiceDetails(s.serviceId, s.optionIdx);
                const service = details?.originalService as any;
                const rawOptions = service?.options || service?.pricingOptions || [];
                const selectedOption = rawOptions[s.optionIdx];
                const selectedVariantId = selectedOption?._id ? String(selectedOption._id) : undefined;
                const selectedAddOns = Array.isArray(s.addOnIds) ? s.addOnIds : [];
                return {
                    serviceId: String(s.serviceId),
                    variantId: selectedVariantId ? [selectedVariantId] : [],
                    selectedAddOns,
                    price: details?.price,
                    duration: parseInt(details?.duration || '0'),
                };
            }),
            paymentMethod: paymentMethod as any,
            paymentStatus: 'pending'
        };
    };

    const handleConfirm = () => {
        bookingMutation.mutate(getBookingData());
    };

    const isNextEnabled =
        (step === 'services' && selectedServices.length > 0) ||
        (step === 'schedule' && selectedDate && selectedTime) ||
        (step === 'details' && formData.name && formData.phone) ||
        (step === 'payment' && paymentMethod !== '');

    const actionButtonText =
        step === 'services' ? 'Select Slot' :
            step === 'schedule' ? 'Continue' :
                step === 'details' ? 'Payment' :
                    'Confirm';

    if (!isLoaded) return null; // Avoid hydration mismatch or flickering

    return (
        <div className="min-h-screen bg-white pb-20 md:pb-0">
            <style jsx global>{`
                nav.sticky.top-0 {
                    display: none !important;
                }
            `}</style>
            <BookingHeader business={business} stepTitle={
                step === 'services' ? 'Select Services' :
                step === 'schedule' ? 'Select Schedule' :
                step === 'details' ? 'Your Details' :
                step === 'payment' ? 'Payment' : 
                step === 'otp' ? 'Verification' : 'Booking'
            } />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <div className="mb-6 md:mb-8">
                    <BookingProgress step={step} />
                </div>

                <div className={`${step === 'success' ? 'block' : 'grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start'}`}>
                    <div className={`${step === 'success' ? '' : 'lg:col-span-2 space-y-5 md:space-y-6'}`}>
                        {step === 'services' && (
                            <BookingServices
                                services={business.services || []}
                                selectedServices={selectedServices}
                                onToggleService={toggleService}
                                onToggleAddOn={toggleServiceAddOn}
                            />
                        )}

                        {step === 'schedule' && (
                            <BookingSchedule
                                businessSlug={business.slug}
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />
                        )}

                        {step === 'details' && (
                            <BookingDetails
                                formData={formData}
                                onUpdateForm={updateForm}
                            />
                        )}

                        {step === 'payment' && (
                            <BookingPayment
                                paymentMethod={paymentMethod}
                                onSelectPayment={setPaymentMethod}
                            />
                        )}

                        {step === 'otp' && (
                            <BookingOTP
                                phone={formData.phone}
                                onVerify={(otp) => verifyOtpMutation.mutate(otp)}
                                onResend={() => bookingMutation.mutate(getBookingData())}
                                isLoading={verifyOtpMutation.isPending}
                                error={otpError}
                            />
                        )}

                        {step === 'success' && (
                            <BookingSuccess
                                business={business}
                                selectedTime={selectedTime}
                                servicesCount={selectedServices.length}
                                totalPrice={totalPrice}
                                selectedServiceDetails={selectedServiceDetails}
                                confirmationCode={confirmationCode}
                                confirmedAppointment={confirmedAppointment}
                            />
                        )}
                    </div>


                    {!['success', 'otp'].includes(step) && (
                        <div className="hidden lg:block">
                            <BookingSummary
                                step={step}
                                selectedServices={selectedServices}
                                availableServices={business.services || []}
                                businessName={business.name}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                formData={formData}
                                paymentMethod={paymentMethod}
                                onNext={handleNext}
                                onBack={handleBack}
                                onConfirm={handleConfirm}
                                isSubmitting={isSubmitting}
                                error={bookingError}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            {!['success', 'otp'].includes(step) && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-4 py-3 z-50 lg:hidden">
                    <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
                        <div className="flex flex-col shrink-0 min-w-[88px]">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider leading-none mb-1">Total</span>
                            <span className="text-lg font-semibold text-zinc-900 leading-none">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            {step !== 'services' && (
                                <button
                                    onClick={handleBack}
                                    className="h-11 px-4 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 bg-white"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                disabled={!isNextEnabled || isSubmitting}
                                onClick={step === 'payment' ? handleConfirm : handleNext}
                                className={`flex-1 h-11 rounded-md text-sm font-semibold ${isNextEnabled ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? 'Processing...' : actionButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default BookingPageContent;
