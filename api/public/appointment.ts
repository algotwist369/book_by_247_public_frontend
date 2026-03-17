import { apiClient } from "../apiClient";
import { z } from "zod";

const phoneSchema = z.string().trim().regex(/^\+?\d{7,15}$/);
const dateSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeSchema = z.string().trim().regex(/^\d{2}:\d{2}$/);
const slugSchema = z.string().trim().min(1).max(120);

const bookingDataSchema = z.object({
    customerInfo: z.object({
        name: z.string().trim().min(2).max(100),
        phone: phoneSchema,
        email: z.string().trim().email().optional(),
        gender: z.string().trim().optional()
    }),
    appointmentDate: dateSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    services: z.array(z.object({
        serviceId: z.string().trim().min(1).max(50),
        price: z.number().min(0).max(1_000_000).optional(),
        duration: z.number().int().min(0).max(24 * 60).optional()
    })).min(1).max(20),
    staffId: z.string().trim().optional(),
    customerNotes: z.string().trim().max(2000).optional(),
    paymentMethod: z.enum(["cash", "online", "card", "upi"] as const),
    paymentStatus: z.enum(["pending", "paid", "partial"] as const).optional(),
    paymentDetails: z.object({
        orderId: z.string().trim().max(200).optional(),
        paymentId: z.string().trim().max(200).optional(),
        signature: z.string().trim().max(200).optional(),
    }).optional()
}).strict();

export interface BookingData {
    customerInfo: {
        name: string;
        phone: string;
        email?: string;
        gender?: string;
    };
    appointmentDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    services: any[];
    staffId?: string;
    customerNotes?: string;
    paymentMethod: 'cash' | 'online' | 'card' | 'upi';
    paymentStatus?: 'pending' | 'paid' | 'partial';
    paymentDetails?: {
        orderId?: string;
        paymentId?: string;
        signature?: string;
    };
}

export const appointmentApi = {
    /**
     * Get available time slots for a business on a specific date
     */
    getAvailableSlots: async (businessSlug: string, date: string, staffId?: string) => {
        slugSchema.parse(businessSlug);
        dateSchema.parse(date);
        if (staffId) z.string().trim().min(1).max(64).parse(staffId);
        const queryParams = new URLSearchParams({ date });
        if (staffId) queryParams.append("staffId", staffId);

        return apiClient<any>(`/appointments/business/${businessSlug}/slots?${queryParams.toString()}`);
    },

    /**
     * Initiate booking (Sends OTP if payment not completed online)
     */
    bookAppointment: async (businessSlug: string, data: BookingData) => {
        slugSchema.parse(businessSlug);
        const validated = bookingDataSchema.parse(data);
        return apiClient<any>(`/appointments/business/${businessSlug}/book`, {
            method: 'POST',
            body: JSON.stringify(validated)
        });
    },

    /**
     * Verify OTP to confirm booking
     */
    verifyOTP: async (businessSlug: string, phone: string, otp: string) => {
        slugSchema.parse(businessSlug);
        phoneSchema.parse(phone);
        z.string().trim().regex(/^\d{4,8}$/).parse(otp);
        return apiClient<any>(`/appointments/business/${businessSlug}/book/verify`, {
            method: 'POST',
            body: JSON.stringify({ phone, otp })
        });
    },

    /**
     * Get appointment details by confirmation code
     */
    getAppointmentByCode: async (code: string) => {
        z.string().trim().min(3).max(64).parse(code);
        return apiClient<any>(`/appointments/confirmation/${code}`);
    },

    /**
     * Cancel appointment by confirmation code
     */
    cancelAppointment: async (code: string, reason?: string) => {
        z.string().trim().min(3).max(64).parse(code);
        if (reason !== undefined) z.string().trim().max(500).parse(reason);
        return apiClient<any>(`/appointments/confirmation/${code}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ cancellationReason: reason })
        });
    }
};
