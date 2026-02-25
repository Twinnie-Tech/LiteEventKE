'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) return [];

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean<IEvent[]>();
    } catch {
        return [];
    }
}

export const getEvents = async (): Promise<IEvent[]> => {
    try {
        await connectDB();

        const events = await Event
            .find({})
            .sort({ createdAt: -1 })
            .lean<IEvent[]>();

        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const createEvent = async () => {
    try {

    } catch (ex) {

    }
}

export const deleteEvent = async () => {
    try {

    } catch (ex) {

    }
}

export const updateEvent = async () => {
    try {

    } catch (ex) {

    }
}


