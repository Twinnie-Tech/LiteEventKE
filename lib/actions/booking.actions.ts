'use server';

import Booking from '@/database/booking.model';

import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
}

export const getBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        await Booking.findOne({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('Not found', e);
        return { success: false };
    }
}

export const cancelBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        await Booking.updateOne({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('canceled booking failed', e);
        return { success: false };
    }
}

export const purchaseTicket = async () => {
    try {


        return { success: true };
    } catch (e) {
        console.error('purchase ticket failed', e);
        return { success: false };
    }
}