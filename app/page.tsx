import {cacheLife} from "next/cache";
import EventsSection from "@/components/EventsSection";
import { getEvents } from "@/lib/actions/event.actions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
    'use cache'
    cacheLife('hours')
    const response = await fetch(`${BASE_URL}/api/events`);
     const  {events}  = await response.json();

    return (
        <main className="wrapper my-10">
           <EventsSection  events={events}/>
        </main>
    )
}

export default Page;
