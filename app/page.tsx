import EventsSection from "@/components/EventsSection";
import { getEvents } from "@/lib/actions/event.actions";
import { Suspense } from "react";

async function  Events() {
    const { events, unavailable } = await getEvents();
    return <EventsSection events={events} unavailable={unavailable} />
}

const Page = async () => {
    return (
        <Suspense fallback={<p className="loading-events">Gathering what&apos;s on around the mountain…</p>}>
            <Events />
        </Suspense>
    )
}

export default Page;
