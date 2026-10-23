'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { json } from 'stream/consumers';

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

export const getEvents = async (): Promise<{ events: IEvent[]; unavailable: boolean }> => {
  try {
    await connectDB();

    const events = await Event
      .find({})
      .sort({ createdAt: -1 })
      .lean();

    return { events: JSON.parse(JSON.stringify(events)), unavailable: false };
  } catch {
    return { events: [], unavailable: true };
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


