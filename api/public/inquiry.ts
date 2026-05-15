import { z } from "zod";
import { apiClient } from "../apiClient";

const inquiryPayloadSchema = z.object({
    business_id: z.string().trim().min(1).optional(),
    business_slug: z.string().trim().min(1).max(160).optional(),
    user_name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^\+?\d{7,15}$/),
    email: z.string().trim().email().optional(),
    otpChannel: z.enum(["email", "sms"] as const).optional(),
    inquiry_type: z.string().trim().max(100).optional(),
    otp: z.string().trim().regex(/^\d{4,8}$/).optional()
}).strict().refine(
    (data) => !!(data.business_id || data.business_slug),
    { message: "Either business_id or business_slug is required" }
);

export type CreateInquiryPayload = z.infer<typeof inquiryPayloadSchema>;

export const inquiryApi = {
    sendInquiryOTP: async (payload: {
        business_id?: string;
        business_slug?: string;
        phone: string;
        email?: string;
        otpChannel?: 'email' | 'sms';
    }) => {
        return apiClient<any>("/inquiries/send-otp", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
    verifyInquiryOTP: async (payload: {
        phone?: string;
        email?: string;
        otp: string;
    }) => {
        return apiClient<any>("/inquiries/verify-otp", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
    createInquiry: async (payload: CreateInquiryPayload) => {
        const validated = inquiryPayloadSchema.parse(payload);
        return apiClient<any>("/inquiries", {
            method: "POST",
            body: JSON.stringify(validated)
        });
    }
};
