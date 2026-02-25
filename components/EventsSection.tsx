"use client"
import { IEvent } from '@/database'
import { useMemo, useState } from 'react'
import ExploreBtn from './ExploreBtn';
import EventCard from './EventCard';

interface Props {
    events: IEvent[]
}

const EventsSection = ({events}: Props) => {
    const [activeTag,setActiveTag] = useState<string>("All");

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();

        events.forEach((event) => {
            event.tags?.forEach((tag) => tagSet.add(tag))
        });

        return ["All", ...Array.from(tagSet)];

    },[events]);

      // Filter events
    const filteredEvents =
        activeTag === "All"
        ? events
        : events.filter((event) =>
            event.tags?.includes(activeTag)
            );


    return (
<section>
      <h1 className="text-center text-3xl font-bold">
        The Most exciting events are at your fingertips <br />
        Event You Can't Miss
      </h1>

      <p className="text-center mt-5 text-gray-600">
        Concerts, Weekend vibes, Weddings, Birthdays, Church Events,
        Seminars, Hackathons, Meetups, Conferences — All in One Place
      </p>

      <div className="flex justify-center mt-8">
        <ExploreBtn />
      </div>

      <div className="mt-20 space-y-7">
        <h3 className="text-xl font-semibold text-center">
          Featured Events
        </h3>

        {/* FILTER TAGS */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full border text-sm transition-all cursor-pointer
                ${
                  activeTag === tag
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* EVENTS GRID */}
        <ul className="events mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li key={event._id?.toString()} className="list-none">
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No events found for this category
            </p>
          )}
        </ul>
      </div>
    </section>
    )
}

export default EventsSection