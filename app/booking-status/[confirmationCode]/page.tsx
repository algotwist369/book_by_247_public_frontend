import React from "react";
import type { Metadata } from "next";
import BookingStatusContent from "./BookingStatusContent";

interface PageProps {
    params: Promise<{
        confirmationCode: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { confirmationCode } = await params;
    return {
        title: `Booking Status ${confirmationCode} - Bookby247`,
        description: "Track real-time appointment booking status and details on Bookby247."
    };
}

const BookingStatusPage = async ({ params }: PageProps) => {
    const { confirmationCode } = await params;
    return <BookingStatusContent confirmationCode={confirmationCode} />;
};

export default BookingStatusPage;

