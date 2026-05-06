"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { appointmentApi } from "@/api/public/appointment";
import { RefreshCcw, Clock3, MapPin, User, CreditCard, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import BackButton from "@/app/business/[slug]/book-appointment/components/BackButton";
import { useQuery } from "@tanstack/react-query";

interface BookingStatusContentProps {
    confirmationCode: string;
}

interface AppointmentData {
    bookingNumber?: string;
    formattedBookingNumber?: string;
    confirmationCode?: string;
    appointmentDate?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    status?: string;
    payment?: {
        status?: string;
        method?: string;
        paidAmount?: number;
        advanceAmount?: number;
    };
    pricing?: {
        servicePrice?: number;
        addOnsPrice?: number;
        additionalCharges?: number;
        discount?: number;
        tax?: number;
        totalAmount?: number;
    };
    remainingAmount?: number;
    bookingSource?: string;
    bookingType?: string;
    customerNotes?: string;
    serviceSnapshot?: {
        name?: string;
        variantName?: string;
        addOnsNames?: string[];
        category?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    business?: {
        name?: string;
        branch?: string;
        address?: string;
        phone?: string;
        email?: string;
        website?: string;
        city?: string;
        state?: string;
        country?: string;
    };
    customer?: {
        name?: string;
        phone?: string;
        email?: string;
        gender?: string;
    };
    services?: Array<{
        _id?: string;
        name?: string;
        duration?: number;
        price?: number;
        category?: string;
        variant?: {
            name?: string;
            price?: number;
            originalPrice?: number;
        };
        addOns?: Array<{
            name?: string;
            price?: number;
            duration?: number;
        }>;
    }>;
}

const BookingStatusContent = ({ confirmationCode }: BookingStatusContentProps) => {
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchAppointment = useCallback(async () => {
        const response = await appointmentApi.getAppointmentByCode(confirmationCode);
        if (!response?.success || !response?.data) {
            throw new Error(response?.message || "Unable to load booking status.");
        }
        return response.data as AppointmentData;
    }, [confirmationCode]);

    const bookingQuery = useQuery({
        queryKey: ["booking-status", confirmationCode],
        queryFn: fetchAppointment,
        enabled: Boolean(confirmationCode),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchInterval: false
    });

    const appointment = bookingQuery.data ?? null;
    const loading = bookingQuery.isLoading;
    const error = bookingQuery.error instanceof Error ? bookingQuery.error.message : null;

    useEffect(() => {
        if (appointment) {
            setLastUpdated(new Date());
        }
    }, [appointment]);

    const customerName = useMemo(() => {
        return appointment?.customer?.name || "-";
    }, [appointment]);

    const formatDate = (value?: string) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", weekday: "long" });
    };

    const formatTime = (value?: string) => {
        if (!value || !/^\d{2}:\d{2}$/.test(value)) return value || "-";
        const [h, m] = value.split(":").map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const pretty = (value?: string) => {
        if (!value) return "-";
        return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
    };

    const money = (value?: number) => Number(value || 0).toLocaleString("en-IN");

    const pricing = appointment?.pricing;
    const payment = appointment?.payment;
    const amountDue = appointment?.remainingAmount ?? Math.max(0, Number(pricing?.totalAmount || 0) - Number(payment?.paidAmount || 0));

    const statusMessage = useMemo(() => {
        const currentStatus = appointment?.status || "";
        if (currentStatus === "pending") return "Your booking request is received and awaiting confirmation from the business.";
        if (currentStatus === "confirmed") return "Your appointment is confirmed. Please arrive 5 minutes before your slot.";
        if (currentStatus === "completed") return "Your appointment is completed. Thank you for booking with us.";
        if (currentStatus === "cancelled") return "This appointment has been cancelled.";
        return "You can refresh this page to check the latest booking status.";
    }, [appointment?.status]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="border border-zinc-200 rounded-lg bg-white p-6 text-sm text-zinc-600">Loading booking status...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
                <div className="border border-red-200 rounded-lg bg-red-50 p-6 text-sm text-red-700">{error}</div>
                <Button type="button" variant="outline" size="sm" onClick={() => bookingQuery.refetch()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-5">
                <BackButton href="/" label="Home" />
                <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Booking Status</p>
                            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">{pretty(appointment?.status)}</h1>
                            <p className="text-sm text-zinc-600 mt-1">Confirmation Code: {appointment?.confirmationCode || confirmationCode}</p>
                            <p className="text-sm text-zinc-600 mt-2">{statusMessage}</p>
                        </div>
                        <Button
                            type="button"
                            onClick={async () => {
                                try {
                                    setRefreshing(true);
                                    await bookingQuery.refetch();
                                } finally {
                                    setRefreshing(false);
                                }
                            }}
                            variant="outline"
                            size="sm"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            {refreshing ? "Refreshing..." : "Refresh"}
                        </Button>
                    </div>
                    {lastUpdated && (
                        <p className="text-xs text-zinc-500 mt-3">Last updated: {lastUpdated.toLocaleTimeString("en-IN")}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Appointment</p>
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-900 font-bold flex items-center gap-2">
                                <Clock3 className="w-4 h-4 text-emerald-500" />
                                {formatDate(appointment?.appointmentDate)}
                            </p>
                            <p className="text-sm text-zinc-700 ml-6 font-medium">
                                {formatTime(appointment?.startTime)} - {formatTime(appointment?.endTime)}
                            </p>
                            <p className="text-xs text-zinc-500 ml-6">Duration: {appointment?.duration || "-"} mins</p>
                            <p className="text-xs text-zinc-500 ml-6 uppercase tracking-tight">Booking ID: <span className="font-bold text-zinc-900">{appointment?.bookingNumber || "-"}</span></p>
                        </div>
                    </div>

                    <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Business Location</p>
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-900 font-bold flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                                {appointment?.business?.name}
                                {appointment?.business?.branch && (
                                    <span className="text-zinc-400 font-normal ml-1 text-xs">({appointment.business.branch})</span>
                                )}
                            </p>
                            <p className="text-xs text-zinc-600 ml-6 leading-relaxed">
                                {appointment?.business?.address}<br />
                                {appointment?.business?.city}, {appointment?.business?.state}, {appointment?.business?.country}
                            </p>
                            <p className="text-xs text-zinc-500 ml-6 font-medium">{appointment?.business?.phone}</p>
                        </div>
                    </div>

                    <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Booked For</p>
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-900 font-bold flex items-center gap-2">
                                <User className="w-4 h-4 text-zinc-400" />
                                {customerName}
                            </p>
                            <p className="text-xs text-zinc-600 ml-6 font-medium">+91 {appointment?.customer?.phone || "-"}</p>
                            {appointment?.customer?.email && <p className="text-xs text-zinc-500 ml-6 break-all">{appointment.customer.email}</p>}
                            {appointment?.customer?.gender && <p className="text-[10px] text-zinc-400 ml-6 uppercase font-bold tracking-tight">Gender: {pretty(appointment.customer.gender)}</p>}
                        </div>
                    </div>

                    <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Status</p>
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-900 font-bold flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-zinc-400" />
                                {pretty(payment?.method)}
                            </p>
                            <div className="ml-6 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${payment?.status === 'confirmed' || payment?.status === 'completed'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {pretty(payment?.status)}
                                    </span>
                                </div>
                                <p className="text-lg font-black text-zinc-900">₹{money(pricing?.totalAmount)}</p>
                                {amountDue > 0 && (
                                    <p className="text-[11px] text-zinc-500 italic font-medium">Remaining to Pay: <span className="text-red-500 not-italic font-bold">₹{money(amountDue)}</span></p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden shadow-sm">
                    <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-zinc-900" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Booked Services</p>
                    </div>
                    <div className="divide-y divide-zinc-100">
                        {(appointment?.services || []).map((service, idx) => (
                            <div key={service._id || idx} className="p-4 sm:p-5 hover:bg-zinc-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{service.name || "Service"}</p>
                                        <p className="text-[11px] text-zinc-500 font-medium">{service.category || "General"}</p>
                                        {service.variant && (
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
                                                Variant: <span className="text-zinc-600">{service.variant.name}</span>
                                            </p>
                                        )}
                                        {service.addOns && service.addOns.length > 0 && (
                                            <div className="mt-2 space-y-1 pl-3 border-l-2 border-zinc-100">
                                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Add-ons</p>
                                                {service.addOns.map((addon, aIdx) => (
                                                    <div key={aIdx} className="flex justify-between items-center text-[11px]">
                                                        <span className="text-zinc-600 font-medium">{addon.name}</span>
                                                        <span className="text-zinc-900 font-bold">+₹{money(addon.price)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left sm:text-right shrink-0">
                                        <p className="text-xs text-zinc-400 font-medium mb-1">{service.duration || "-"} mins</p>
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm font-black text-zinc-900">₹{money(service.price)}</p>
                                            {service.variant?.originalPrice !== undefined && service.variant.originalPrice > 0 && (
                                                <p className="text-[10px] text-zinc-400 line-through">₹{money(service.variant.originalPrice)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pricing && (
                        <div className="bg-zinc-50 p-5 border-t border-zinc-200">
                            <div className="max-w-xs ml-auto space-y-2">
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>Service Total</span>
                                    <span className="font-bold text-zinc-900">₹{money(pricing.servicePrice)}</span>
                                </div>
                                {Number(pricing.addOnsPrice) > 0 && (
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span>Add-ons Total</span>
                                        <span className="font-bold text-zinc-900">₹{money(pricing.addOnsPrice)}</span>
                                    </div>
                                )}
                                {Number(pricing.tax) > 0 && (
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span>Tax (GST)</span>
                                        <span className="font-bold text-zinc-900">₹{money(pricing.tax)}</span>
                                    </div>
                                )}
                                {Number(pricing.discount) > 0 && (
                                    <div className="flex justify-between items-center text-xs text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-bold">-₹{money(pricing.discount)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                                    <span className="text-sm font-black text-zinc-900 uppercase">Total Amount</span>
                                    <span className="text-xl font-black text-zinc-900">₹{money(pricing.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {(!appointment?.services || appointment.services.length === 0) && (
                        <p className="px-4 py-3 text-sm text-zinc-500">No services found for this booking.</p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Need help with your booking?</p>
                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">support@bookby247.com</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="font-bold text-xs uppercase tracking-widest px-6" size="sm">Explore Businesses</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingStatusContent;

