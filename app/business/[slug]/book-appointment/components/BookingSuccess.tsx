import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MapPin, Clock, Receipt, Check, Download } from 'lucide-react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { Business } from '@/components/business/businessData';

interface BookingSuccessProps {
    business: Business;
    selectedTime: string;
    servicesCount: number;
    totalPrice: number;
    selectedServiceDetails: { name?: string; duration?: string }[];
    confirmationCode: string;
    confirmedAppointment?: {
        appointmentDate?: string;
        startTime?: string;
        endTime?: string;
        status?: string;
        paymentMethod?: string;
        paymentStatus?: string;
        totalAmount?: number;
        bookingNumber?: string;
        formattedBookingNumber?: string;
        createdAt?: string;
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
    } | null;
}

const BookingSuccess = ({
    business,
    selectedTime,
    servicesCount,
    totalPrice,
    selectedServiceDetails,
    confirmationCode,
    confirmedAppointment
}: BookingSuccessProps) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(confirmationCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error('Failed to copy confirmation code:', error);
        }
    };

    const formatDate = (value?: string) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatDayName = (value?: string) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-IN', { weekday: 'long' });
    };

    const formatTime12Hour = (value?: string) => {
        if (!value || !/^\d{2}:\d{2}$/.test(value)) return value || '-';
        const [h, m] = value.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const prettyValue = (value?: string) => {
        if (!value) return '-';
        return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
    };

    const displayServices = confirmedAppointment?.services?.length
        ? confirmedAppointment.services.map((item) => ({
            name: item.name || 'Service',
            duration: item.duration ? `${item.duration} mins` : '-',
            price: item.price || 0
        }))
        : selectedServiceDetails.map((item) => ({
            name: item.name || 'Service',
            duration: item.duration || '-',
            price: 0
        }));

    const displayTotal = confirmedAppointment?.totalAmount ?? totalPrice;
    const startTime = confirmedAppointment?.startTime || selectedTime;
    const endTime = confirmedAppointment?.endTime || '-';
    const totalDuration = displayServices.reduce((sum, item) => {
        const match = item.duration?.match(/\d+/);
        return sum + (match ? Number(match[0]) : 0);
    }, 0);
    const bookingId = confirmedAppointment?.formattedBookingNumber || confirmedAppointment?.bookingNumber;
    const customerName = [confirmedAppointment?.customer?.firstName, confirmedAppointment?.customer?.lastName].filter(Boolean).join(' ').trim() || '-';
    const venueName = confirmedAppointment?.business?.name || business.name;
    const venueAddress = confirmedAppointment?.business?.address || business.address;
    const venuePhone = confirmedAppointment?.business?.phone || '-';
    const invoiceDate = formatDate(confirmedAppointment?.createdAt || confirmedAppointment?.appointmentDate);

    const handleDownloadInvoice = () => {
        const servicesRows = displayServices.map((service) => `
            <tr>
                <td style="padding:10px;border:1px solid #ddd;">${service.name}</td>
                <td style="padding:10px;border:1px solid #ddd;text-align:center;">${service.duration}</td>
                <td style="padding:10px;border:1px solid #ddd;text-align:center;">${service.price.toLocaleString('en-IN')}</td>
            </tr>
        `).join('');

        const invoiceHtml = `
            <html>
                <head>
                    <title>Invoice ${bookingId || confirmationCode}</title>
                </head>
                <body style="background:#fff;padding:20px;">
                    <div style="max-width:700px;margin:auto;font-family:Arial,sans-serif;border:1px solid #eee;padding:20px;border-radius:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;padding-bottom:10px;">
                            <div>
                                <h2 style="margin:0;">${venueName}</h2>
                                <p style="margin:2px 0;">${venueAddress}</p>
                                <p style="margin:2px 0;">Phone: ${venuePhone}</p>
                            </div>
                            <div style="text-align:right;">
                                <h3 style="margin:0;">INVOICE</h3>
                                <p style="margin:2px 0;">Booking ID: <strong>${bookingId || confirmationCode}</strong></p>
                                <p style="margin:2px 0;">Date: ${invoiceDate}</p>
                            </div>
                        </div>
                        <div style="margin-top:15px;">
                            <h4 style="margin-bottom:5px;">Bill To:</h4>
                            <p style="margin:0;"><strong>${customerName}</strong></p>
                            <p style="margin:0;">Phone: ${confirmedAppointment?.customer?.phone || '-'}</p>
                        </div>
                        <div style="margin-top:15px;">
                            <h4 style="margin-bottom:5px;">Appointment Details:</h4>
                            <p style="margin:0;">Date: ${formatDate(confirmedAppointment?.appointmentDate)} (${formatDayName(confirmedAppointment?.appointmentDate)})</p>
                            <p style="margin:0;">Time: ${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}</p>
                            <p style="margin:0;">Duration: ${totalDuration} mins</p>
                        </div>
                        <table style="width:100%;margin-top:20px;border-collapse:collapse;">
                            <thead>
                                <tr style="background:#f5f5f5;">
                                    <th style="padding:10px;border:1px solid #ddd;text-align:left;">Service</th>
                                    <th style="padding:10px;border:1px solid #ddd;">Duration</th>
                                    <th style="padding:10px;border:1px solid #ddd;">Price (₹)</th>
                                </tr>
                            </thead>
                            <tbody>${servicesRows}</tbody>
                        </table>
                        <div style="margin-top:20px;text-align:right;">
                            <p style="margin:5px 0;">Subtotal: ₹${displayTotal.toLocaleString('en-IN')}</p>
                            <p style="margin:5px 0;">Discount: ₹0</p>
                            <p style="margin:5px 0;">Tax: ₹0</p>
                            <h3 style="margin:10px 0;">Total: ₹${displayTotal.toLocaleString('en-IN')}</h3>
                        </div>
                        <div style="margin-top:10px;">
                            <p style="margin:0;">Payment Method: ${prettyValue(confirmedAppointment?.paymentMethod)}</p>
                            <p style="margin:0;">Payment Status: ${prettyValue(confirmedAppointment?.paymentStatus)}</p>
                        </div>
                        <div style="margin-top:20px;border-top:1px solid #eee;padding-top:10px;text-align:center;">
                            <p style="margin:0;">Thank you for choosing ${venueName}!</p>
                            <p style="margin:4px 0 0 0;">Support: support@bookby247.com</p>
                        </div>
                    </div>
                    <script>window.onload = function(){ window.print(); }</script>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) return;
        printWindow.document.open();
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
    };

    return (
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-0 py-4 sm:py-6 lg:py-8">
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden mb-4 sm:mb-5 lg:mb-6">
                <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6 border-b border-zinc-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-zinc-900 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">Booking Confirmed</h2>
                                <p className="text-sm text-zinc-600 mt-1 break-words">
                                    Your appointment with {venueName} is confirmed.
                                </p>
                            </div>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Confirmation Code</p>
                            <div className="mt-1 flex items-center sm:justify-end gap-2">
                                <p className="text-base sm:text-lg font-semibold text-zinc-900 break-all">{confirmationCode}</p>
                                <button
                                    type="button"
                                    onClick={handleCopyCode}
                                    aria-label="Copy confirmation code"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                                >
                                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-7 lg:py-7 space-y-5 sm:space-y-6 lg:space-y-7">
                    <section>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-3 sm:mb-4">Appointment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div className="border border-zinc-200 rounded-md p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-zinc-500">Location</p>
                                        <p className="text-sm font-medium text-zinc-900 mt-1">{venueName}</p>
                                        <p className="text-sm text-zinc-600 mt-1 break-words">{venueAddress}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-zinc-200 rounded-md p-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-zinc-500">Date & Time</p>
                                        <p className="text-sm font-medium text-zinc-900 mt-1 leading-relaxed">
                                            {formatDate(confirmedAppointment?.appointmentDate)} ({formatDayName(confirmedAppointment?.appointmentDate)}) | {formatTime12Hour(startTime)} - {formatTime12Hour(endTime)}
                                        </p>
                                        <p className="text-sm text-zinc-600 mt-1">Please arrive 5 minutes early</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-3 sm:mb-4">Booking Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div className="border border-zinc-200 rounded-md p-4 space-y-2">
                                <p className="text-xs uppercase tracking-wide text-zinc-500">Customer</p>
                                <p className="text-sm text-zinc-900 break-words">{customerName}</p>
                                <p className="text-sm text-zinc-600">{confirmedAppointment?.customer?.phone || '-'}</p>
                            </div>
                            <div className="border border-zinc-200 rounded-md p-4 space-y-2">
                                <p className="text-xs uppercase tracking-wide text-zinc-500">Payment & Status</p>
                                <p className="text-sm text-zinc-900">Status: {prettyValue(confirmedAppointment?.status)}</p>
                                <p className="text-sm text-zinc-600 break-words">
                                    {prettyValue(confirmedAppointment?.paymentMethod)} | {prettyValue(confirmedAppointment?.paymentStatus)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <Receipt className="w-4 h-4 text-zinc-500" />
                                <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500 truncate">Services & Pricing</h3>
                            </div>
                            <span className="text-xs sm:text-sm text-zinc-600 whitespace-nowrap">{displayServices.length || servicesCount} service{(displayServices.length || servicesCount) > 1 ? 's' : ''}</span>
                        </div>
                        <div className="border border-zinc-200 rounded-md divide-y divide-zinc-200">
                            {displayServices.map((service, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-3">
                                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                                        <Check className="w-4 h-4 text-zinc-500" />
                                        <span className="text-sm font-medium text-zinc-900 break-words">{service.name}</span>
                                    </div>
                                    <div className="text-left sm:text-right pl-6 sm:pl-0">
                                        <span className="text-sm text-zinc-600">{service.duration}</span>
                                        {service.price > 0 && <p className="text-xs text-zinc-500">₹{service.price.toLocaleString('en-IN')}</p>}
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-zinc-50">
                                <span className="text-sm font-medium text-zinc-700">Total Amount</span>
                                <span className="text-lg font-semibold text-zinc-900">₹{displayTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </section>

                    <div className="pt-3 sm:pt-4 border-t border-zinc-200">
                        <p className="text-xs text-zinc-500">Please keep your confirmation code ready when you arrive at the venue.</p>
                        <p className="text-xs text-zinc-500 mt-1">Need help? Contact support@bookby247.com</p>
                    </div>

                    <div className="pt-1 sm:pt-2">
                        <button
                            type="button"
                            onClick={handleDownloadInvoice}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-zinc-300 text-zinc-900 text-sm font-medium hover:bg-zinc-50"
                        >
                            <Download className="w-4 h-4" />
                            Download Invoice
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-5 lg:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                    href={`/booking-status/${confirmationCode}`}
                    className="h-11 inline-flex items-center justify-center rounded-md border border-zinc-900 text-zinc-900 text-sm font-medium hover:bg-zinc-50"
                >
                    Track Booking Status
                </Link>
                <Link
                    href="/"
                    className="h-11 inline-flex items-center justify-center rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800"
                >
                    Return Home
                </Link>
                <Link
                    href={`/business/${business.slug}`}
                    className="h-11 inline-flex items-center justify-center rounded-md border border-zinc-300 text-zinc-900 text-sm font-medium hover:bg-zinc-50"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccess;

