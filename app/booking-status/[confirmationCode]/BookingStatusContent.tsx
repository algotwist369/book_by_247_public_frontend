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
    paymentStatus?: string;
    paymentMethod?: string;
    totalAmount?: number;
    servicePrice?: number;
    additionalCharges?: number;
    discount?: number;
    tax?: number;
    paidAmount?: number;
    advanceAmount?: number;
    bookingSource?: string;
    bookingType?: string;
    customerNotes?: string;
    reminderSent?: boolean;
    confirmationSent?: boolean;
    followUpRequired?: boolean;
    followUpCompleted?: boolean;
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
        firstName?: string;
        lastName?: string;
        phone?: string;
        email?: string;
        address?: {
            country?: string;
        };
    };
    services?: Array<{
        _id?: string;
        name?: string;
        duration?: number;
        price?: number;
        category?: string;
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
        const first = appointment?.customer?.firstName || "";
        const last = appointment?.customer?.lastName || "";
        return `${first} ${last}`.trim() || "-";
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
    const amountDue = Math.max(0, Number(appointment?.totalAmount || appointment?.servicePrice || 0) - Number(appointment?.paidAmount || 0));

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
                <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Appointment</p>
                    <p className="text-sm text-zinc-900 flex items-start gap-2"><Clock3 className="w-4 h-4 mt-0.5" /> {formatDate(appointment?.appointmentDate)}</p>
                    <p className="text-sm text-zinc-700">{formatTime(appointment?.startTime)} - {formatTime(appointment?.endTime)}</p>
                    <p className="text-sm text-zinc-700">Duration: {appointment?.duration || "-"} mins</p>
                    <p className="text-sm text-zinc-700">Booking ID: {appointment?.bookingNumber || "-"}</p>
                </div>

                <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Business</p>
                    <p className="text-sm text-zinc-900 flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> {appointment?.business?.name || "-"}</p>
                    <p className="text-sm text-zinc-700">{appointment?.business?.branch ? `${appointment.business.branch}, ` : ""}{appointment?.business?.address || "-"}</p>
                    <p className="text-sm text-zinc-700">{appointment?.business?.phone || "-"}</p>
                    <p className="text-sm text-zinc-700 break-all">{appointment?.business?.email || "-"}</p>
                </div>

                <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Booked For</p>
                    <p className="text-sm text-zinc-900 flex items-start gap-2"><User className="w-4 h-4 mt-0.5" /> {customerName}</p>
                    <p className="text-sm text-zinc-700">{appointment?.customer?.phone || "-"}</p>
                    {appointment?.customer?.email && <p className="text-sm text-zinc-700 break-all">{appointment.customer.email}</p>}
                </div>

                <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5 space-y-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Payment</p>
                    <p className="text-sm text-zinc-900 flex items-start gap-2"><CreditCard className="w-4 h-4 mt-0.5" /> {pretty(appointment?.paymentMethod)}</p>
                    <p className="text-sm text-zinc-700">Status: {pretty(appointment?.paymentStatus)}</p>
                    <p className="text-sm text-zinc-700">Subtotal: Rs {money(appointment?.servicePrice)}</p>
                    <p className="text-sm text-zinc-700">Additional: Rs {money(appointment?.additionalCharges)}</p>
                    <p className="text-sm text-zinc-700">Discount: Rs {money(appointment?.discount)}</p>
                    <p className="text-sm text-zinc-700">Tax: Rs {money(appointment?.tax)}</p>
                    <p className="text-sm font-medium text-zinc-900">Total: Rs {money(appointment?.totalAmount || appointment?.servicePrice)}</p>
                    <p className="text-sm text-zinc-700">Paid: Rs {money(appointment?.paidAmount)}</p>
                    <p className="text-sm font-medium text-zinc-900">Amount Due: Rs {money(amountDue)}</p>
                </div>
            </div>

            <div className="border border-zinc-200 rounded-lg bg-white p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                    <BadgeCheck className="w-4 h-4 text-zinc-700" />
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Services</p>
                </div>
                <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
                    {(appointment?.services || []).map((service, idx) => (
                        <div key={service._id || idx} className="px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <p className="text-sm font-medium text-zinc-900">{service.name || "Service"}</p>
                                <p className="text-xs text-zinc-500 mt-1">{service.category || "General"}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm text-zinc-700">{service.duration || "-"} mins</p>
                                <p className="text-sm font-medium text-zinc-900">Rs {Number(service.price || 0).toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                    ))}
                    {(!appointment?.services || appointment.services.length === 0) && (
                        <p className="px-4 py-3 text-sm text-zinc-500">No services found for this booking.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto" size="sm">Back to Home</Button>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto" size="sm">Explore Businesses</Button>
                </Link>
            </div>
            <p className="text-xs text-zinc-500">Need help? Contact support@bookby247.com</p>
            </div>
        </div>
    );
};

export default BookingStatusContent;

