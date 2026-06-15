import { z } from "zod";
import { apiClient } from "../apiClient";

const sendInquiryOtpPayloadSchema = z.object({
    phone: z.string().trim().regex(/^\+?\d{7,15}$/).optional(),
    email: z.string().trim().email().optional(),
    otpChannel: z.enum(["email", "sms"] as const).optional()
}).strict().refine(
    (data) => !!(data.phone || data.email),
    { message: "Either phone or email is required" }
);

const inquiryPayloadSchema = z.object({
    business_id: z.string().trim().min(1),
    user_name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^\+?\d{7,15}$/),
    email: z.string().trim().email().optional(),
    inquiry_type: z.string().trim().max(100).optional(),
    otp: z.string().trim().regex(/^\d{4,8}$/)
}).strict();

export type CreateInquiryPayload = z.infer<typeof inquiryPayloadSchema>;
export type SendInquiryOtpPayload = z.infer<typeof sendInquiryOtpPayloadSchema>;

export const inquiryApi = {
    sendInquiryOTP: async (payload: SendInquiryOtpPayload) => {
        const validated = sendInquiryOtpPayloadSchema.parse(payload);
        return apiClient<any>("/inquiries/send-otp", {
            method: "POST",
            body: JSON.stringify(validated)
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
