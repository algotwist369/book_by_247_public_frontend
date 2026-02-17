import { apiClient } from "../apiClient";

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
        const queryParams = new URLSearchParams({ date });
        if (staffId) queryParams.append("staffId", staffId);

        return apiClient<any>(`/appointments/business/${businessSlug}/slots?${queryParams.toString()}`);
    },

    /**
     * Initiate booking (Sends OTP if payment not completed online)
     */
    bookAppointment: async (businessSlug: string, data: BookingData) => {
        return apiClient<any>(`/appointments/business/${businessSlug}/book`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * Verify OTP to confirm booking
     */
    verifyOTP: async (businessSlug: string, phone: string, otp: string) => {
        return apiClient<any>(`/appointments/business/${businessSlug}/book/verify`, {
            method: 'POST',
            body: JSON.stringify({ phone, otp })
        });
    },

    /**
     * Get appointment details by confirmation code
     */
    getAppointmentByCode: async (code: string) => {
        return apiClient<any>(`/appointments/confirmation/${code}`);
    },

    /**
     * Cancel appointment by confirmation code
     */
    cancelAppointment: async (code: string, reason?: string) => {
        return apiClient<any>(`/appointments/confirmation/${code}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ cancellationReason: reason })
        });
    }
};
