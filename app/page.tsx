import EventsSection from "@/components/EventsSection";
import { getEvents } from "@/lib/actions/event.actions";
import { Suspense } from "react";

async function  Events() {
    const  events  =  await getEvents();
    return <EventsSection events={events} />
}

const Page = async () => {
    return (
        <main className="wrapper my-10">
           <Suspense fallback={<p>Loading events...</p>}>
                <Events />
           </Suspense>
        </main>
    )
}

export default Page;
