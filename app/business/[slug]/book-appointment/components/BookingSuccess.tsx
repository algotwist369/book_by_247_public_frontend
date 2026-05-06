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
    selectedServiceDetails: { name?: string; duration?: string; price?: number; originalPrice?: number }[];
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
        business?: {
            name?: string;
            branch?: string;
            address?: string;
            phone?: string;
        };
        customer?: {
            _id?: string;
            name?: string;
            phone?: string;
            email?: string;
        };
        services?: Array<{
            _id?: string;
            name?: string;
            price?: number;
            originalPrice?: number;
            duration?: number;
            variant?: {
                name?: string;
                price?: number;
                originalPrice?: number;
            };
            addOns?: Array<{
                name?: string;
                price?: number;
            }>;
        }>;
        pricing?: {
            servicePrice?: number;
            addOnsPrice?: number;
            tax?: number;
            totalAmount?: number;
            discount?: number;
        };
        remainingAmount?: number;
        serviceSnapshot?: {
            name?: string;
            variantName?: string;
            addOnsNames?: string[];
        };
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
            price: item.price || 0, // sellingPrice
            originalPrice: item.originalPrice || 0, // previousPrice
            variantName: item.variant?.name,
            addOns: item.addOns
        }))
        : selectedServiceDetails.map((item) => ({
            name: item.name || 'Service',
            duration: item.duration || '-',
            price: item.price || 0,
            originalPrice: item.originalPrice || 0,
            variantName: undefined,
            addOns: undefined
        }));

    const pricing = confirmedAppointment?.pricing;
    const displayTotal = pricing?.totalAmount ?? totalPrice;
    const startTime = confirmedAppointment?.startTime || selectedTime;
    const endTime = confirmedAppointment?.endTime || '-';
    const totalDuration = displayServices.reduce((sum, item) => {
        const match = item.duration?.match(/\d+/);
        return sum + (match ? Number(match[0]) : 0);
    }, 0);
    const bookingId = confirmedAppointment?.formattedBookingNumber || confirmedAppointment?.bookingNumber;
    const customerName = confirmedAppointment?.customer?.name || confirmedAppointment?.customer?.name || 'Guest User';
    const customerPhone = confirmedAppointment?.customer?.phone || confirmedAppointment?.customer?.phone || '-';
    const customerEmail = confirmedAppointment?.customer?.email || confirmedAppointment?.customer?.email;
    const venueName = confirmedAppointment?.business?.name || business.name;
    const venueAddress = confirmedAppointment?.business?.address || business.address;
    const venuePhone = confirmedAppointment?.business?.phone || '-';
    const invoiceDate = formatDate(confirmedAppointment?.createdAt || confirmedAppointment?.appointmentDate);

    const handleDownloadInvoice = () => {
        const servicesRows = displayServices.map((service) => `
            <tr>
                <td style="padding:10px;border:1px solid #ddd;">
                    <div style="font-weight:bold;">${service.name}</div>
                    ${service.variantName ? `<div style="font-size:11px;color:#666;margin-top:2px;">Variant: ${service.variantName}</div>` : ''}
                    ${service.addOns && service.addOns.length > 0 ? `
                        <div style="margin-top:5px;padding-left:10px;border-left:2px solid #eee;">
                            <div style="font-size:10px;color:#999;text-transform:uppercase;font-weight:bold;">Add-ons:</div>
                            ${service.addOns.map(a => `<div style="font-size:11px;color:#444;">${a.name} (+₹${a.price?.toLocaleString('en-IN')})</div>`).join('')}
                        </div>
                    ` : ''}
                </td>
                <td style="padding:10px;border:1px solid #ddd;text-align:center;">${service.duration}</td>
                <td style="padding:10px;border:1px solid #ddd;text-align:right;">
                    ${service.originalPrice > 0 ? `<span style="text-decoration:line-through;color:#a1a1aa;font-size:12px;margin-right:8px;">₹${service.originalPrice.toLocaleString('en-IN')}</span>` : ''}
                    <span style="font-weight:bold;">₹${service.price.toLocaleString('en-IN')}</span>
                </td>
            </tr>
        `).join('');

        const invoiceHtml = `
            <html>
                <head>
                    <title>Invoice ${bookingId || confirmationCode}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #18181b; }
                        .container { max-width: 800px; margin: auto; border: 1px solid #e4e4e7; padding: 40px; border-radius: 8px; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f4f4f5; padding-bottom: 20px; margin-bottom: 20px; }
                        .business-info h2 { margin: 0; font-size: 24px; font-weight: 900; }
                        .business-info p { margin: 4px 0; color: #71717a; font-size: 13px; }
                        .invoice-meta { text-align: right; }
                        .invoice-meta h3 { margin: 0; font-size: 20px; font-weight: 900; color: #18181b; }
                        .invoice-meta p { margin: 4px 0; font-size: 13px; color: #71717a; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
                        .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #a1a1aa; margin-bottom: 8px; letter-spacing: 0.05em; }
                        .info-box p { margin: 4px 0; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background: #f4f4f5; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; font-weight: 900; color: #71717a; border: 1px solid #e4e4e7; }
                        td { padding: 12px; border: 1px solid #e4e4e7; font-size: 14px; }
                        .totals { margin-top: 30px; margin-left: auto; width: 300px; }
                        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #71717a; }
                        .total-row.grand-total { border-top: 2px solid #f4f4f5; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: 900; color: #18181b; }
                        .footer { margin-top: 50px; text-align: center; border-top: 1px solid #f4f4f5; padding-top: 20px; font-size: 12px; color: #a1a1aa; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="business-info">
                                <h2>${venueName}</h2>
                                ${confirmedAppointment?.business?.branch ? `<p>Branch: ${confirmedAppointment.business.branch}</p>` : ''}
                                <p>${venueAddress}</p>
                                <p>Phone: ${venuePhone}</p>
                            </div>
                            <div class="invoice-meta">
                                <h3>INVOICE</h3>
                                <p>No: <strong>${bookingId || confirmationCode}</strong></p>
                                <p>Date: ${invoiceDate}</p>
                            </div>
                        </div>

                        <div class="details-grid">
                            <div class="info-box">
                                <div class="section-title">Bill To</div>
                                <p><strong>${customerName}</strong></p>
                                <p>${customerPhone}</p>
                                ${customerEmail ? `<p>${customerEmail}</p>` : ''}
                            </div>
                            <div class="info-box">
                                <div class="section-title">Appointment</div>
                                <p><strong>${formatDate(confirmedAppointment?.appointmentDate)}</strong></p>
                                <p>${formatDayName(confirmedAppointment?.appointmentDate)} | ${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}</p>
                                <p>Total Duration: ${totalDuration} mins</p>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th style="text-align:center;width:100px;">Duration</th>
                                    <th style="text-align:right;width:120px;">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>${servicesRows}</tbody>
                        </table>

                        <div class="totals">
                            <div class="total-row">
                                <span>Service Total</span>
                                <span>₹${pricing?.servicePrice?.toLocaleString('en-IN') || displayTotal.toLocaleString('en-IN')}</span>
                            </div>
                            ${pricing?.addOnsPrice ? `
                                <div class="total-row">
                                    <span>Add-ons Total</span>
                                    <span>₹${pricing.addOnsPrice.toLocaleString('en-IN')}</span>
                                </div>
                            ` : ''}
                            ${pricing?.tax ? `
                                <div class="total-row">
                                    <span>Tax (GST)</span>
                                    <span>₹${pricing.tax.toLocaleString('en-IN')}</span>
                                </div>
                            ` : ''}
                            ${pricing?.discount ? `
                                <div class="total-row" style="color:#10b981;">
                                    <span>Discount</span>
                                    <span>-₹${pricing.discount.toLocaleString('en-IN')}</span>
                                </div>
                            ` : ''}
                            <div class="total-row grand-total">
                                <span>Total Amount</span>
                                <span>₹${displayTotal.toLocaleString('en-IN')}</span>
                            </div>
                            ${confirmedAppointment?.remainingAmount && confirmedAppointment.remainingAmount < displayTotal ? `
                                <div class="total-row" style="font-style:italic;">
                                    <span>Remaining to Pay</span>
                                    <span>₹${confirmedAppointment.remainingAmount.toLocaleString('en-IN')}</span>
                                </div>
                            ` : ''}
                        </div>

                        <div style="margin-top:40px;font-size:13px;">
                            <div class="section-title">Payment Info</div>
                            <p style="margin:4px 0;">Method: <strong>${prettyValue(confirmedAppointment?.paymentMethod)}</strong></p>
                            <p style="margin:4px 0;">Status: <strong>${prettyValue(confirmedAppointment?.paymentStatus)}</strong></p>
                        </div>

                        <div class="footer">
                            <p>Thank you for choosing ${venueName}!</p>
                            <p style="margin-top:8px;">This is a computer generated invoice and does not require a signature.</p>
                            <p>Support: support@bookby247.com | bookby247.com</p>
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
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600"
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
                                        <p className="text-sm font-medium text-zinc-900 mt-1">
                                            {venueName}
                                            {confirmedAppointment?.business?.branch && (
                                                <span className="text-zinc-400 font-normal ml-1.5">({confirmedAppointment.business.branch})</span>
                                            )}
                                        </p>
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
                                <p className="text-sm text-zinc-900 font-bold break-words">{customerName}</p>
                                <p className="text-sm text-zinc-600">{customerPhone}</p>
                                {customerEmail && (
                                    <p className="text-sm text-zinc-600 mt-0.5">{customerEmail}</p>
                                )}
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
                        <div className="border border-zinc-200 rounded-md overflow-hidden">
                            <div className="divide-y divide-zinc-200">
                                {displayServices.map((service, idx) => (
                                    <div key={idx} className="p-3 sm:p-4 bg-white">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span className="text-sm font-bold text-zinc-900 break-words">{service.name}</span>
                                                </div>
                                                {service.variantName && (
                                                    <p className="text-[11px] text-zinc-500 ml-6 font-medium uppercase tracking-wider mt-0.5">
                                                        Variant: {service.variantName}
                                                    </p>
                                                )}
                                                {service.addOns && service.addOns.length > 0 && (
                                                    <div className="ml-6 mt-1.5 space-y-1">
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Add-ons:</p>
                                                        {service.addOns.map((addon, aIdx) => (
                                                            <div key={aIdx} className="flex justify-between items-center text-[11px]">
                                                                <span className="text-zinc-600">{addon.name}</span>
                                                                <span className="text-zinc-900 font-semibold">+₹{addon.price?.toLocaleString('en-IN')}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-left sm:text-right pl-6 sm:pl-0 shrink-0">
                                                <span className="text-xs font-medium text-zinc-400 block mb-1">{service.duration}</span>
                                                <div className="flex flex-col items-end">
                                                    <p className="text-sm text-zinc-900 font-bold leading-none">₹{service.price.toLocaleString('en-IN')}</p>
                                                    {service.originalPrice > 0 && (
                                                        <p className="text-[10px] text-zinc-400 line-through mt-1">₹{service.originalPrice.toLocaleString('en-IN')}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pricing && (
                                <div className="bg-zinc-50 p-4 border-t border-zinc-200 space-y-2">
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span>Service Total</span>
                                        <span className="font-medium text-zinc-900">₹{pricing.servicePrice?.toLocaleString('en-IN')}</span>
                                    </div>
                                    {pricing.addOnsPrice !== undefined && pricing.addOnsPrice > 0 && (
                                        <div className="flex justify-between items-center text-xs text-zinc-500">
                                            <span>Add-ons Total</span>
                                            <span className="font-medium text-zinc-900">₹{pricing.addOnsPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    {pricing.tax !== undefined && pricing.tax > 0 && (
                                        <div className="flex justify-between items-center text-xs text-zinc-500">
                                            <span>Tax (GST)</span>
                                            <span className="font-medium text-zinc-900">₹{pricing.tax.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    {pricing.discount !== undefined && pricing.discount > 0 && (
                                        <div className="flex justify-between items-center text-xs text-emerald-600">
                                            <span>Discount</span>
                                            <span className="font-medium">-₹{pricing.discount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                                        <span className="text-sm font-bold text-zinc-900">Total Amount</span>
                                        <span className="text-lg font-black text-zinc-900">₹{displayTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    {confirmedAppointment.remainingAmount !== undefined && confirmedAppointment.remainingAmount > 0 && confirmedAppointment.remainingAmount !== displayTotal && (
                                        <div className="flex items-center justify-between pt-1 text-xs text-zinc-500 italic">
                                            <span>Remaining to Pay</span>
                                            <span>₹{confirmedAppointment.remainingAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!pricing && (
                                <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-zinc-50 border-t border-zinc-200">
                                    <span className="text-sm font-bold text-zinc-900">Total Amount</span>
                                    <span className="text-lg font-black text-zinc-900">₹{displayTotal.toLocaleString('en-IN')}</span>
                                </div>
                            )}
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
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-zinc-300 text-zinc-900 text-sm font-medium"
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
                    className="h-11 inline-flex items-center justify-center rounded-md border border-zinc-900 text-zinc-900 text-sm font-medium"
                >
                    Track Booking Status
                </Link>
                <Link
                    href="/"
                    className="h-11 inline-flex items-center justify-center rounded-md bg-zinc-900 text-white text-sm font-medium"
                >
                    Return Home
                </Link>
                <Link
                    href={`/business/${business.slug}`}
                    className="h-11 inline-flex items-center justify-center rounded-md border border-zinc-300 text-zinc-900 text-sm font-medium"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccess;

