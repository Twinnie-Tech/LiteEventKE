import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';
import { getSession } from "@/lib/current-user";

function textList(value: FormDataEntryValue | null) {
    if (typeof value !== "string") {
        return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()).filter(Boolean) : [];
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ message: 'Sign in before hosting an event.' }, { status: 401 });
        }

        await connectDB();

        const formData = await req.formData();
        const file = formData.get('image');

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        let tags: string[];
        let agenda: string[];

        try {
            tags = textList(formData.get('tags'));
            agenda = textList(formData.get('agenda'));
        } catch {
            return NextResponse.json({ message: 'Tags and agenda must be lists.' }, { status: 400 });
        }

        if (tags.length === 0 || agenda.length === 0) {
            return NextResponse.json({ message: 'Add at least one tag and one agenda item.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'MlimaEvents' }, (error, results) => {
                if (error || !results) return reject(error || new Error('Image upload failed'));

                resolve(results);
            }).end(buffer);
        });

        const createdEvent = await Event.create({
            title: String(formData.get('title') || '').trim(),
            description: String(formData.get('description') || '').trim(),
            overview: String(formData.get('overview') || '').trim(),
            image: (uploadResult as { secure_url: string }).secure_url,
            venue: String(formData.get('venue') || '').trim(),
            location: String(formData.get('location') || '').trim(),
            date: String(formData.get('date') || '').trim(),
            time: String(formData.get('time') || '').trim(),
            mode: String(formData.get('mode') || '').trim(),
            audience: String(formData.get('audience') || '').trim(),
            organizer: String(formData.get('organizer') || session.name).trim(),
            tags,
            agenda,
            hostId: session.userId,
            hostEmail: session.email,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}
